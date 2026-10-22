"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2, Plus, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { createAdminUserFormSchema, type CreateAdminUserFormValues } from "@/lib/admin/schemas";
import { useAdminUsers } from "@/lib/admin/useAdminUsers";
import { ADMIN_SECTIONS, ADMIN_SECTION_LABELS, type AdminSection, type AdminUser } from "@/lib/admin/types";
import { FormField, inputClass } from "./form/FormField";
import { ListSkeleton } from "./ListSkeleton";

function SectionCheckboxes({
  value,
  onChange,
  allowNone = false,
}: {
  value: AdminSection[];
  onChange: (next: AdminSection[]) => void;
  /** Muestra la casilla extra "Sin permisos" — solo tiene sentido al EDITAR a alguien que ya existe, no al crear uno nuevo. */
  allowNone?: boolean;
}) {
  function toggle(section: AdminSection) {
    onChange(value.includes(section) ? value.filter((s) => s !== section) : [...value, section]);
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {ADMIN_SECTIONS.map((section) => (
        <label
          key={section}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            checked={value.includes(section)}
            onChange={() => toggle(section)}
          />
          {ADMIN_SECTION_LABELS[section]}
        </label>
      ))}
      {allowNone && (
        <label className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600">
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            checked={value.length === 0}
            onChange={() => onChange([])}
          />
          Sin permisos
        </label>
      )}
    </div>
  );
}

const dateFormatter = new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
const dateTimeFormatter = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" });

function isExpired(accessUntil: string | null): boolean {
  if (!accessUntil) return false;
  return accessUntil < new Date().toISOString().slice(0, 10);
}

function SectionBadges({ sections, accessUntil }: { sections: AdminSection[]; accessUntil: string | null }) {
  const expired = isExpired(accessUntil);

  if (sections.length === 0 || expired) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
        {expired ? `Sin acceso · venció el ${dateFormatter.format(new Date(`${accessUntil}T00:00:00`))}` : "Sin acceso"}
      </span>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {sections.map((section) => (
        <span
          key={section}
          className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700"
        >
          {ADMIN_SECTION_LABELS[section]}
        </span>
      ))}
      {accessUntil && (
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          Hasta el {dateFormatter.format(new Date(`${accessUntil}T00:00:00`))}
        </span>
      )}
    </div>
  );
}

function CreateUserModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (input: {
    name: string;
    email: string;
    password: string;
    sections: AdminSection[];
    accessUntil?: string | null;
  }) => Promise<void>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAdminUserFormValues>({
    resolver: zodResolver(createAdminUserFormSchema),
    defaultValues: { name: "", email: "", password: "", sections: [], accessUntil: "" },
  });

  const sections = watch("sections") as AdminSection[];

  async function onSubmit(values: CreateAdminUserFormValues) {
    setServerError(null);
    try {
      await onCreate({
        ...values,
        sections: values.sections as AdminSection[],
        accessUntil: values.accessUntil || null,
      });
      reset();
      onClose();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "No se pudo crear el usuario.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Crear usuario">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField label="Nombre" htmlFor="newUserName" required error={errors.name?.message}>
          <input id="newUserName" className={inputClass} {...register("name")} />
        </FormField>
        <FormField label="Correo" htmlFor="newUserEmail" required error={errors.email?.message}>
          <input id="newUserEmail" type="email" className={inputClass} {...register("email")} />
        </FormField>
        <FormField
          label="Contraseña"
          htmlFor="newUserPassword"
          required
          error={errors.password?.message}
          hint="Mínimo 8 caracteres — compártela con la persona por un canal seguro."
        >
          <input id="newUserPassword" type="text" className={inputClass} {...register("password")} />
        </FormField>
        <FormField label="¿Qué puede ver y editar?" required error={errors.sections?.message as string | undefined}>
          <SectionCheckboxes value={sections ?? []} onChange={(next) => setValue("sections", next, { shouldValidate: true })} />
        </FormField>
        <FormField
          label="Acceso hasta (opcional)"
          htmlFor="newUserAccessUntil"
          hint="Déjalo en blanco para que el acceso no tenga fecha de vencimiento. Si pones una fecha, pasado ese día queda automáticamente en Sin permisos."
        >
          <input id="newUserAccessUntil" type="date" className={inputClass} {...register("accessUntil")} />
        </FormField>

        {serverError && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {serverError}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" className="border border-slate-200" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creando…" : "Crear usuario"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function lastSignInLabel(lastSignInAt: string | null): string {
  if (!lastSignInAt) return "Nunca ha entrado";
  return `Última vez: ${dateTimeFormatter.format(new Date(lastSignInAt))}`;
}

export function UsersDashboard({ currentUserId }: { currentUserId: string }) {
  const { users, isReady, createUser, updateAccess, removeUser } = useAdminUsers();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);
  const [editSections, setEditSections] = useState<AdminSection[]>([]);
  const [editAccessUntil, setEditAccessUntil] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function openEdit(user: AdminUser) {
    setEditTarget(user);
    setEditSections(user.sections);
    setEditAccessUntil(user.accessUntil ?? "");
  }

  async function saveEdit() {
    if (!editTarget) return;
    setError(null);
    try {
      await updateAccess(editTarget.id, { sections: editSections, accessUntil: editAccessUntil || null });
      setEditTarget(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setError(null);
    try {
      await removeUser(deleteTarget.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar.");
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-slate-900">Usuarios</h2>
          <p className="mt-1 text-sm text-slate-500">
            Quién puede entrar al panel y qué parte puede ver cada quien. {users.length} usuario
            {users.length === 1 ? "" : "s"} en total.
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Crear usuario
        </Button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          Permisos actualizados.
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {!isReady ? (
        <ListSkeleton />
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900">
                  {user.name}
                  {user.id === currentUserId && <span className="ml-1.5 text-xs font-normal text-slate-400">(tú)</span>}
                </p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
                <p className="mt-0.5 text-xs text-slate-400">{lastSignInLabel(user.lastSignInAt)}</p>
                <div className="mt-2">
                  <SectionBadges sections={user.sections} accessUntil={user.accessUntil} />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {user.id === currentUserId ? (
                  <span
                    title="No puedes cambiar tu propio acceso aquí — pídele a otro usuario con 'Todo' que lo haga, para evitar que te quedes sin entrar por accidente."
                    className="px-2 text-xs text-slate-400"
                  >
                    No editable
                  </span>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      aria-label="Cambiar permisos"
                      title="Cambiar permisos"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600"
                    >
                      <UserCog className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(user)}
                      aria-label="Eliminar acceso"
                      title="Eliminar acceso"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateUserModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createUser} />

      <Modal open={editTarget !== null} onClose={() => setEditTarget(null)} title={`Permisos de ${editTarget?.name ?? ""}`}>
        <div className="space-y-4">
          <SectionCheckboxes value={editSections} onChange={setEditSections} allowNone />
          <FormField
            label="Acceso hasta (opcional)"
            htmlFor="editUserAccessUntil"
            hint="Déjalo en blanco para que el acceso no tenga fecha de vencimiento. Si pones una fecha, pasado ese día queda automáticamente en Sin permisos (sin borrar lo que marcaste arriba)."
          >
            <input
              id="editUserAccessUntil"
              type="date"
              className={inputClass}
              value={editAccessUntil}
              onChange={(event) => setEditAccessUntil(event.target.value)}
            />
          </FormField>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" className="border border-slate-200" onClick={() => setEditTarget(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="primary" onClick={saveEdit}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Eliminar acceso"
        confirmLabel="Eliminar"
        description={
          <>
            ¿Quitarle el acceso al panel a <strong className="font-semibold text-slate-900">“{deleteTarget?.name}”</strong>?
            Su cuenta de inicio de sesión no se borra, solo deja de poder entrar — se puede volver a agregar después.
          </>
        }
      />
    </div>
  );
}
