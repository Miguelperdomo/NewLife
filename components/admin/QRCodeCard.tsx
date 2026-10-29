"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Loader2, QrCode } from "lucide-react";

// genera el QR en el navegador, sin servicio externo — para imprimir en volantes/pendones
export function QRCodeCard({ url, label }: { url: string; label: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, { width: 320, margin: 1 }).then((result) => {
      if (!cancelled) setDataUrl(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
        <QrCode className="h-4 w-4 text-slate-400" aria-hidden="true" />
        Código QR
      </p>
      <p className="mt-0.5 text-xs text-slate-500">
        Para imprimir en volantes o pendones — al escanearlo, abre directo «{label}».
      </p>

      <div className="mt-3 flex items-center gap-4">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL local, no es una imagen remota que next/image deba optimizar.
            <img src={dataUrl} alt={`Código QR de ${label}`} className="h-full w-full" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" aria-hidden="true" />
          )}
        </div>

        {dataUrl && (
          <a
            href={dataUrl}
            download={`qr-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Descargar
          </a>
        )}
      </div>
    </div>
  );
}
