let ctx: AudioContext | null = null;
function ensureCtx() {
  if (ctx) return ctx;
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  ctx = AC ? new AC() : null;
  return ctx;
}

function beep(freq: number, time = 0.12, type: OscillatorType = 'sine') {
  const c = ensureCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = 0.08;
  o.connect(g);
  g.connect(c.destination);
  o.start();
  o.stop(c.currentTime + time);
}

/**
 * Reproduce un patrón de audio corto según tipo de validación.
 */
export function playBeep(kind: 'ok' | 'warn' | 'err' | 'offline' | 'reentry') {
  if (kind === 'ok') {
    // Entrada válida (nuevo acceso)
    beep(880, 0.08, 'triangle');
    setTimeout(() => beep(1320, 0.08, 'triangle'), 100);
  } else if (kind === 'warn') {
    // Duplicado sin datos de persona
    beep(660, 0.12, 'sawtooth');
    setTimeout(() => beep(520, 0.12, 'sawtooth'), 120);
  } else if (kind === 'err') {
    // Código no válido
    beep(220, 0.18, 'square');
    setTimeout(() => beep(180, 0.18, 'square'), 140);
  } else if (kind === 'offline') {
    // Guardado offline
    beep(740, 0.06, 'triangle');
  } else if (kind === 'reentry') {
    // Ya había ingresado (reingreso)
    beep(420, 0.1, 'square');
    setTimeout(() => beep(320, 0.1, 'square'), 120);
  }
}
