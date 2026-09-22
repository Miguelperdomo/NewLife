/**
 * Genera una paleta de 11 tonos (50 a 950, al estilo Tailwind) a partir de
 * un solo color hexadecimal — así "Color principal"/"Color de acento" en
 * Configuración pueden recolorear todo el sitio (botones, hovers, fondos
 * claros...) sin tener que pedirle al administrador 11 colores distintos.
 * No es ciencia del color perfecta, pero da un resultado visualmente
 * coherente manteniendo el mismo matiz (H) que el color elegido.
 */
function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;

  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const SHADE_LIGHTNESS: Record<string, number> = {
  "50": 97,
  "100": 93,
  "200": 85,
  "300": 74,
  "400": 62,
  "500": 50,
  "600": 42,
  "700": 34,
  "800": 27,
  "900": 21,
  "950": 13,
};

export function generateColorShades(baseHex: string): Record<string, string> {
  if (!/^#[0-9a-fA-F]{6}$/.test(baseHex)) return {};

  const [h, s] = hexToHsl(baseHex);
  const shades: Record<string, string> = {};

  for (const [key, lightness] of Object.entries(SHADE_LIGHTNESS)) {
    // Un poco menos saturado en los extremos muy claros/oscuros para que no
    // se vea "quemado" — mismo criterio visual que usan las paletas de Tailwind.
    const adjustedSaturation = lightness > 90 || lightness < 20 ? s * 0.85 : s;
    shades[key] = hslToHex(h, adjustedSaturation, lightness);
  }

  return shades;
}
