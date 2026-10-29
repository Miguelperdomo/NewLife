// Utilidades de slug compartidas (Contenido, Sedes, Ministerios...). Antes
// estaban duplicadas en cada hook, las sacamos de una vez para acá.
export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uniqueSlug(base: string, existing: string[], fallback = "elemento") {
  const cleanBase = base || fallback;
  if (!existing.includes(cleanBase)) return cleanBase;
  let i = 2;
  while (existing.includes(`${cleanBase}-${i}`)) i++;
  return `${cleanBase}-${i}`;
}
