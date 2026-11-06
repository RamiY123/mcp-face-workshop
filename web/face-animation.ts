// Animate a decorative copy in a fixed overlay so the face can escape its clipped card.
// The real image stays in layout, and acknowledgement does not wait for the flourish.
export function createFaceAnimator(face: HTMLImageElement) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active: { layer: HTMLDivElement; animations: Animation[] } | undefined;
  const stop = () => {
    const previous = active;
    active = undefined;
    previous?.animations.forEach(animation => animation.cancel());
    previous?.layer.remove();
    face.style.opacity = '';
  };
  window.addEventListener('resize', stop);
  window.addEventListener('scroll', stop, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  reducedMotion.addEventListener('change', stop);

  function play(name: string) {
    stop();
    if (reducedMotion.matches || document.hidden) return;
    const rect = face.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const intense = ['angry', 'shocked', 'laughing', 'love'].includes(name);
    const duration = intense ? 2500 : 2100;
    const angle = name === 'angry' ? 11 : name === 'sleepy' ? -9 : 7;
    const visibleSize = Math.min(rect.width, rect.height);
    const scale = Math.max(1, Math.min(intense ? 2.05 : 1.8, (innerWidth - 40) / visibleSize, (innerHeight - 80) / visibleSize));
    const x = innerWidth / 2 - (rect.left + rect.width / 2);
    const y = innerHeight * .43 - (rect.top + rect.height / 2);
    const layer = document.createElement('div');
    layer.className = `reaction-overlay${intense ? ' reaction-intense' : ''}`;
    layer.setAttribute('aria-hidden', 'true');
    const flyingFace = face.cloneNode() as HTMLImageElement;
    flyingFace.removeAttribute('id');
    flyingFace.alt = '';
    flyingFace.className = 'face-popout';
    Object.assign(flyingFace.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, opacity: '1' });
    layer.append(flyingFace);
    document.body.append(layer);
    face.style.opacity = '0';
    const transform = (dx: number, dy: number, size: number, rotation: number) => `translate(${dx}px, ${dy}px) scale(${size}) rotate(${rotation}deg)`;
    const animation = flyingFace.animate([
      { transform: transform(0, 0, 1, 0), offset: 0 },
      { transform: transform(0, 14, .9, -angle / 2), offset: .09 },
      { transform: transform(x, y, scale, angle), offset: .31 },
      { transform: transform(x, y - 12, scale * .98, -angle * .7), offset: .43 },
      { transform: transform(x, y, scale, angle * .35), offset: .54 },
      { transform: transform(0, -13, 1.08, -3), offset: .82 },
      { transform: transform(0, 6, .96, 1), offset: .92 },
      { transform: transform(0, 0, 1, 0), offset: 1 }
    ], { duration, easing: 'cubic-bezier(.22,.7,.3,1)', fill: 'both' });
    const animations = [animation];
    // One expanding ring and a short radial spark burst, without flashing the page.
    const ring = document.createElement('span');
    ring.className = 'reaction-ring';
    Object.assign(ring.style, { left: `${innerWidth / 2}px`, top: `${innerHeight * .43}px`, width: `${visibleSize * scale * .9}px`, height: `${visibleSize * scale * .9}px` });
    layer.prepend(ring);
    animations.push(ring.animate([
      { transform: 'translate(-50%, -50%) scale(.6)', opacity: 0 },
      { transform: 'translate(-50%, -50%) scale(.9)', opacity: .6, offset: .2 },
      { transform: 'translate(-50%, -50%) scale(1.4)', opacity: 0 }
    ], { duration: 1200, delay: duration * .2, fill: 'both', easing: 'ease-out' }));
    for (let index = 0; index < 8; index++) {
      const spark = document.createElement('span');
      spark.className = 'reaction-spark';
      const radians = index * Math.PI / 4;
      const radius = visibleSize * scale * .52;
      Object.assign(spark.style, { left: `${innerWidth / 2}px`, top: `${innerHeight * .43}px`, background: index % 2 ? '#ffad67' : '#d2a7ff' });
      layer.prepend(spark);
      const sparkTransform = (factor: number) => `translate(${Math.cos(radians) * radius * factor}px, ${Math.sin(radians) * radius * factor}px) rotate(${index * 45}deg) scale(${1.4 - factor / 2})`;
      animations.push(spark.animate([
        { transform: sparkTransform(.5), opacity: 0 },
        { transform: sparkTransform(.9), opacity: 1, offset: .2 },
        { transform: sparkTransform(1.4), opacity: 0 }
      ], { duration: 1100, delay: duration * .23, fill: 'both', easing: 'ease-out' }));
    }
    active = { layer, animations };
    animation.finished.then(() => { if (active?.layer === layer) stop(); }).catch(() => { /* A newer command or reduced-motion change cancelled this effect. */ });
  }
  return { play, stop };
}
