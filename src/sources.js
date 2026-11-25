/** Fuentes oficiales (URLs verificadas con HTTP 200 el 2026-11-25). */
export const SOURCES = [
  {
    id: 'lft-art-74',
    label: 'Ley Federal del Trabajo, art. 74 (texto vigente, diputados.gob.mx)',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/pdf/LFT.pdf',
  },
  {
    id: 'dof-2006',
    label: 'DOF 17-01-2006: decreto por el que se reforma el art. 74 de la LFT',
    url: 'https://www.diputados.gob.mx/LeyesBiblio/ref/lft/LFT_ref24_17ene06.pdf',
  },
];

export function renderSources(container, sources = SOURCES, doc = globalThis.document) {
  const ul = doc.createElement('ul');
  ul.className = 'sources';
  for (const s of sources) {
    const li = doc.createElement('li');
    const a = doc.createElement('a');
    a.setAttribute('href', s.url);
    a.textContent = s.label;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    li.appendChild(a);
    ul.appendChild(li);
  }
  container.replaceChildren(ul);
  return ul;
}
