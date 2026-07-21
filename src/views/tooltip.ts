// Gemeinsame Tooltip-Komponente (Plan-Phase 0/1, siehe PLAN-Tooltip-System.md): ersetzt das
// native title= durch ein selbst gestyltes Div mit fixer max-width und dynamisch wachsender
// Hoehe ("fixed width, dynamic length"). Hover ist heute der einzige Trigger; ein spaeterer
// i-Button (Tap statt Hover) kann showTooltip/hideTooltip wiederverwenden, ohne diese
// Komponente neu zu bauen.

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Baut das data-tooltip-Attribut fuer einen Call-Site-String - Ersatz fuer das bisherige
 *  title="..." an genau denselben Stellen. Leer, wenn kein Text vorhanden ist. */
export function tooltipAttr(raw: string | undefined): string {
  if (!raw) return '';
  return ` data-tooltip="${escapeHtml(raw)}"`;
}

let tooltipEl: HTMLDivElement | null = null;
let currentTrigger: HTMLElement | null = null;

function ensureTooltipEl(): HTMLDivElement {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'app-tooltip';
    tooltipEl.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltipEl);
  }
  return tooltipEl;
}

/** Bevorzugt unterhalb des Triggers, klappt nach oben um, wenn unten kein Platz mehr ist -
 *  Breite ist fix (siehe CSS max-width), nur die Hoehe waechst mit dem Text. */
function positionTooltip(trigger: HTMLElement, el: HTMLDivElement): void {
  const rect = trigger.getBoundingClientRect();
  const margin = 8;
  const spaceBelow = window.innerHeight - rect.bottom;
  const top = spaceBelow >= el.offsetHeight + margin || rect.top < el.offsetHeight + margin
    ? rect.bottom + margin
    : rect.top - el.offsetHeight - margin;
  const maxLeft = window.innerWidth - el.offsetWidth - margin;
  el.style.top = `${Math.max(margin, top)}px`;
  el.style.left = `${Math.max(margin, Math.min(rect.left, maxLeft))}px`;
}

function showTooltip(trigger: HTMLElement): void {
  const text = trigger.dataset.tooltip;
  if (!text) return;
  const el = ensureTooltipEl();
  el.textContent = text;
  el.style.display = 'block';
  currentTrigger = trigger;
  positionTooltip(trigger, el);
}

function hideTooltip(): void {
  if (!tooltipEl) return;
  tooltipEl.style.display = 'none';
  currentTrigger = null;
}

/** Einmalig beim App-Start aufrufen (siehe main.ts). Event-Delegation auf document.body
 *  ueberlebt jedes komplette Neu-Rendern (main.ts ersetzt app.innerHTML bei jeder Aenderung) -
 *  daher kein erneutes Wiring in den einzelnen renderXView()-Funktionen noetig. */
export function initTooltips(): void {
  document.body.addEventListener('mouseover', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-tooltip]');
    if (!target || target === currentTrigger) return;
    showTooltip(target);
  });
  document.body.addEventListener('mouseout', (e) => {
    if (!currentTrigger) return;
    const from = (e.target as HTMLElement).closest<HTMLElement>('[data-tooltip]');
    if (from !== currentTrigger) return;
    const to = (e.relatedTarget as HTMLElement | null)?.closest<HTMLElement>('[data-tooltip]');
    if (to === from) return;
    hideTooltip();
  });
  // Sicherheitsnetz: bei Scroll (z.B. innerhalb eines aufgeklappten <details>) waere die
  // fixed-Position sonst falsch, bis die Maus sich erneut bewegt.
  window.addEventListener('scroll', hideTooltip, true);
}
