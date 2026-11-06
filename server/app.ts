import express from 'express';
import type { Response } from 'express';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { z } from 'zod';
import { manifest, checkAssets } from '../shared/manifest.js';
import { assetDirectory, root } from '../shared/config.js';

export function createApp() {
  checkAssets();
  const app = express();
  let state = { name: 'neutral', commandId: randomUUID(), changedAt: new Date().toISOString(), source: 'startup' };
  const viewers = new Map<string, Response>();
  const displayed = new Set<string>();
  const pending = new Map<string, (value: boolean) => void>();
  // Loopback binding plus Host/Origin validation prevents browser-origin commands and DNS rebinding.
  app.use((req, res, next) => {
    if (!['127.0.0.1', 'localhost'].includes(req.hostname)) { res.status(403).json({ error: 'Local host required' }); return; }
    const origin = req.get('origin');
    if (origin && origin !== `http://${req.get('host')}`) { res.status(403).json({ error: 'Same-origin requests only' }); return; }
    next();
  });
  app.use(express.json({ limit: '4kb' }));
  app.get('/api/health', (_req, res) => res.json({ ok: true, viewers: viewers.size, temporaryAssets: manifest.temporary }));
  app.get('/api/expressions', (_req, res) => res.json(manifest));
  app.get('/api/state', (_req, res) => res.json({ ...state, viewers: viewers.size, displayed: displayed.has(state.commandId) }));
  app.get('/api/events', (req, res) => {
    const viewerId = randomUUID();
    res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.flushHeaders();
    viewers.set(viewerId, res);
    res.write(`data: ${JSON.stringify({ ...state, viewerId })}\n\n`);
    const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 15000);
    req.on('close', () => { clearInterval(heartbeat); viewers.delete(viewerId); });
  });
  app.post('/api/ack', (req, res) => {
    const input = z.object({ commandId: z.string(), viewerId: z.string() }).safeParse(req.body);
    if (!input.success) { res.status(400).json({ error: 'commandId and viewerId required' }); return; }
    const { commandId, viewerId } = input.data;
    if (!viewers.has(viewerId) || commandId !== state.commandId) { res.status(409).json({ error: 'Stale command or disconnected viewer' }); return; }
    displayed.add(commandId);
    pending.get(commandId)?.(true);
    res.json({ ok: true });
  });
  app.post('/api/expression', async (req, res) => {
    const input = z.object({ name: z.string(), source: z.enum(['manual', 'mcp']).default('manual') }).safeParse(req.body);
    if (!input.success || !manifest.expressions.some(e => e.id === input.data.name)) {
      res.status(400).json({ error: `Unknown expression. Choose: ${manifest.expressions.map(e => e.id).join(', ')}` }); return;
    }
    state = { ...input.data, commandId: randomUUID(), changedAt: new Date().toISOString() };
    displayed.clear();
    const command = { ...state };
    const hasViewers = viewers.size > 0;
    const confirmation = hasViewers ? new Promise<boolean>(resolveConfirmation => {
      const timer = setTimeout(() => { pending.delete(command.commandId); resolveConfirmation(false); }, 1500);
      pending.set(command.commandId, value => { clearTimeout(timer); pending.delete(command.commandId); resolveConfirmation(value); });
    }) : Promise.resolve(false);
    for (const [viewerId, stream] of viewers) stream.write(`data: ${JSON.stringify({ ...command, viewerId })}\n\n`);
    const confirmed = await confirmation;
    res.json({ ...command, accepted: true, displayed: confirmed, status: confirmed ? 'displayed' : hasViewers ? 'accepted_unconfirmed' : 'accepted_no_viewer' });
  });
  app.use('/assets/expressions', express.static(assetDirectory));
  app.use(express.static(resolve(root, 'dist/web')));
  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(400).json({ error: error.message });
  });
  return app;
}
