import type { ReactNode } from "react";

/**
 * Markdown muy simple, sin librería nueva — pensado para que un texto legal
 * pegado desde ChatGPT (con "## Título", "**negrilla**", listas "- algo" o
 * "1. algo") se vea bien en vez de mostrar los símbolos tal cual. Cubre solo
 * lo que de verdad aparece en estos textos (Política de privacidad/Términos),
 * no es un parser de Markdown completo.
 */

/** "texto **en negrilla** normal" -> nodos con <strong> donde corresponda. */
function parseInline(text: string): ReactNode[] {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    // Los índices impares son justo lo que quedó CAPTURADO entre **...** (ver split con grupo).
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );
}

function headingLevel(line: string): 1 | 2 | 3 | 4 | null {
  if (line.startsWith("#### ")) return 4;
  if (line.startsWith("### ")) return 3;
  if (line.startsWith("## ")) return 2;
  if (line.startsWith("# ")) return 1;
  return null;
}

function isListLine(line: string): boolean {
  return /^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line);
}

function stripListMarker(line: string): string {
  return line.replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "");
}

export function renderMarkdownLite(text: string): ReactNode {
  const blocks = text.split("\n\n").filter((block) => block.trim());

  return blocks.map((block, blockIndex) => {
    const lines = block.split("\n").filter((line) => line.trim());
    const level = headingLevel(lines[0] ?? "");

    if (level && lines.length === 1) {
      const content = lines[0].replace(/^#{1,4}\s+/, "");
      // "# Título" usa <h2> (no <h2>, no un segundo <h1> — la página ya tiene
      // el suyo propio arriba), solo que más grande que "## " para que se
      // note la jerarquía.
      if (level === 1) {
        return (
          <h2 key={blockIndex} className="mt-2 font-heading text-2xl font-bold text-slate-900">
            {parseInline(content)}
          </h2>
        );
      }
      if (level === 2) {
        return (
          <h2 key={blockIndex} className="mt-2 font-heading text-xl font-bold text-slate-900">
            {parseInline(content)}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3 key={blockIndex} className="mt-2 font-heading text-lg font-bold text-slate-900">
            {parseInline(content)}
          </h3>
        );
      }
      return (
        <h4 key={blockIndex} className="mt-2 font-heading text-base font-bold text-slate-900">
          {parseInline(content)}
        </h4>
      );
    }

    if (lines.every(isListLine)) {
      const isOrdered = /^\d+\.\s+/.test(lines[0]);
      const items = lines.map((line, lineIndex) => <li key={lineIndex}>{parseInline(stripListMarker(line))}</li>);
      return isOrdered ? (
        <ol key={blockIndex} className="list-decimal space-y-1 pl-5">
          {items}
        </ol>
      ) : (
        <ul key={blockIndex} className="list-disc space-y-1 pl-5">
          {items}
        </ul>
      );
    }

    return <p key={blockIndex}>{parseInline(block)}</p>;
  });
}
