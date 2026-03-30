let shakeIntensity = 0;
let shakeDuration = 0;
let shakeTimer = 0;

export function triggerScreenShake(intensity = 5, duration = 300): void {
  shakeIntensity = intensity;
  shakeDuration = duration;
  shakeTimer = 0;
}

export function updateScreenShake(dt: number): { offsetX: number; offsetY: number } {
  if (shakeTimer >= shakeDuration) {
    shakeIntensity = 0;
    return { offsetX: 0, offsetY: 0 };
  }

  shakeTimer += dt;
  const decay = 1 - shakeTimer / shakeDuration;
  const currentIntensity = shakeIntensity * decay;

  return {
    offsetX: (Math.random() - 0.5) * currentIntensity * 2,
    offsetY: (Math.random() - 0.5) * currentIntensity * 2,
  };
}

export function isScreenShaking(): boolean {
  return shakeTimer < shakeDuration && shakeIntensity > 0;
}
