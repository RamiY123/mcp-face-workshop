// MCP text-content envelope shared by the working example and student tools.
export const result = (value: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }] });
