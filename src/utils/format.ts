/** Dublonen-Zahl mit maximal drei Nachkommastellen, deutsches Komma statt Punkt. */
export function formatDublonenNumber(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return rounded.toLocaleString('de-DE', { maximumFractionDigits: 3 });
}

export function formatDublonen(value: number): string {
  return `${formatDublonenNumber(value)} D`;
}
