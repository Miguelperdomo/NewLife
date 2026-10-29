import type { UseFormRegister, FieldValues, Path } from "react-hook-form";

// campo trampa anti-spam: oculto y sin tabIndex, ninguna persona lo ve ni lo
// llena, pero los bots sí. Si llega algo escrito aquí en el onSubmit, se finge
// éxito sin mandar nada (ver PersonalStepsSection / VisitCheckinWidget).
export function HoneypotField<T extends FieldValues>({ register }: { register: UseFormRegister<T> }) {
  return (
    <div className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
      <label htmlFor="website">No llenar este campo</label>
      <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website" as Path<T>)} />
    </div>
  );
}
