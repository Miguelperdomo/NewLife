import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

/**
 * Campo señuelo anti-spam: fuera de la pantalla y sin tabIndex, así que
 * ninguna persona real lo ve ni lo llena — pero los bots que rellenan
 * formularios automáticamente sí lo hacen. Quien use esto revisa en el
 * onSubmit si llegó algo escrito aquí y, si llegó, finge éxito sin enviar
 * nada de verdad (ver PersonalStepsSection / VisitCheckinWidget).
 */
export function HoneypotField<T extends FieldValues>({ register }: { register: UseFormRegister<T> }) {
  return (
    <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor="website">No llenar este campo</label>
      <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website" as Path<T>)} />
    </div>
  );
}
