/**
 * Utilidades de slug compartidas por los hooks del admin (Contenido, Sedes,
 * Ministerios...). Antes vivían duplicadas dentro de cada hook; al sumar un
 * tercer módulo que las necesita, se extraen aquí una sola vez.
 */
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
