"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import "react-day-picker/dist/style.css";

import {
  appointmentSchema,
  type AppointmentFormValues,
} from "@/lib/validations/appointment";
import { APPOINTMENT_REASON_LABELS } from "@/lib/types";

const TIME_SLOTS = [
  { value: "09:00", label: "9:00 - 10:00 AM" },
  { value: "10:00", label: "10:00 - 11:00 AM" },
  { value: "11:00", label: "11:00 - 12:00 PM" },
  { value: "14:00", label: "2:00 - 3:00 PM" },
  { value: "15:00", label: "3:00 - 4:00 PM" },
  { value: "16:00", label: "4:00 - 5:00 PM" },
  { value: "17:00", label: "5:00 - 6:00 PM" },
];

export default function BookingForm() {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { additional_comment: "", website: "" },
  });

  const selectedDate = watch("appointment_date");

  const onSubmit = async (values: AppointmentFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? "No se pudo registrar la cita.");
      }

      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado. Intenta nuevamente."
      );
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg rounded-sm border border-gold/30 bg-cream p-10 text-center shadow-soft animate-fade-in">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold-dark" strokeWidth={1.25} />
        <h3 className="mt-6 font-serif text-2xl text-navy">
          Su cita ha sido registrada correctamente
        </h3>
        <p className="mt-3 text-navy/70">
          Un asesor de Precious by Orocash lo recibirá en la fecha
          seleccionada.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-secondary mt-8 !py-3 text-xs"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto grid max-w-3xl grid-cols-1 gap-6 rounded-sm border border-navy/10 bg-cream p-8 shadow-soft sm:grid-cols-2 md:p-12"
      noValidate
    >
      {/* Honeypot anti-spam, oculto para humanos */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />

      <Field label="Nombre completo" error={errors.full_name?.message} full>
        <input
          type="text"
          placeholder="Ej. María Fernanda Torres"
          className="input-luxe"
          {...register("full_name")}
        />
      </Field>

      <Field label="Número de cédula" error={errors.identification_number?.message}>
        <input
          type="text"
          placeholder="1712345678"
          className="input-luxe"
          {...register("identification_number")}
        />
      </Field>

      <Field label="Número de celular" error={errors.phone?.message}>
        <input
          type="tel"
          placeholder="+593 99 999 9999"
          className="input-luxe"
          {...register("phone")}
        />
      </Field>

      <Field label="Correo electrónico" error={errors.email?.message} full>
        <input
          type="email"
          placeholder="nombre@correo.com"
          className="input-luxe"
          {...register("email")}
        />
      </Field>

      <Field label="Motivo de la cita" error={errors.appointment_reason?.message}>
        <select
          className="input-luxe"
          {...register("appointment_reason", { required: "Selecciona el motivo de tu cita" })}
        >
          <option value="">Selecciona una opción</option>
          {Object.entries(APPOINTMENT_REASON_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Hora de visita" error={errors.appointment_time?.message}>
        <select
          className="input-luxe"
          {...register("appointment_time", { required: "Selecciona una hora" })}
        >
          <option value="">Selecciona una hora</option>
          {TIME_SLOTS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Fecha de visita" error={errors.appointment_date?.message} full>
        <Controller
          control={control}
          name="appointment_date"
          render={({ field }) => (
            <div className="relative" ref={calendarRef}>
              <button
                type="button"
                onClick={() => setCalendarOpen((v) => !v)}
                className="input-luxe flex w-full items-center justify-between text-left"
              >
                <span className={field.value ? "text-navy" : "text-navy/40"}>
                  {field.value
                    ? format(new Date(field.value + "T00:00:00"), "PPP", { locale: es })
                    : "Selecciona una fecha"}
                </span>
                <CalendarDays className="h-4 w-4 text-gold-dark" />
              </button>

              {calendarOpen && (
                <div className="absolute z-20 mt-2 rounded-sm border border-navy/10 bg-cream p-3 shadow-soft">
                  <DayPicker
                    mode="single"
                    locale={es}
                    disabled={{ before: new Date() }}
                    selected={field.value ? new Date(field.value + "T00:00:00") : undefined}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(format(date, "yyyy-MM-dd"));
                        setCalendarOpen(false);
                      }
                    }}
                    classNames={{
                      day_selected: "bg-navy text-cream",
                      day_today: "text-gold-dark font-semibold",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        />
      </Field>

      <Field label="Comentario adicional (opcional)" error={errors.additional_comment?.message} full>
        <textarea
          rows={4}
          placeholder="Cuéntanos brevemente sobre tu(s) pieza(s) o consulta"
          className="input-luxe resize-none"
          {...register("additional_comment")}
        />
      </Field>

      {serverError && (
        <p className="sm:col-span-2 text-sm text-rose-600">{serverError}</p>
      )}

      <div className="sm:col-span-2 mt-2 flex flex-col items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
            </>
          ) : (
            "Confirmar cita privada"
          )}
        </button>
        <p className="text-center text-xs text-navy/50">
          Sus datos son confidenciales y se usan únicamente para gestionar su
          cita.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  full,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-2 block text-xs uppercase tracking-widest2 text-navy/60">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
