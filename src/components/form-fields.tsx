"use client";

import type { ReactNode } from "react";

/* Light-theme form controls. Labels sit above the control, every control has a
   visible border and a green focus ring — readable on white, and obvious on a
   phone. Shared by the customer, dealer and contact forms. */

const control =
  "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[0.9375rem] text-ink outline-none transition-colors placeholder:text-ash/70 focus:border-zap-ink";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = true,
  pattern,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate">
        {label}
        {required ? "" : " · optional"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        pattern={pattern}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={control}
      />
      {hint ? <span className="mt-2 block text-xs text-ash">{hint}</span> : null}
    </label>
  );
}

export function Select({
  label,
  name,
  children,
  required = false,
  defaultValue = "",
  value,
  onChange,
}: {
  label: string;
  name: string;
  children: ReactNode;
  required?: boolean;
  defaultValue?: string;
  /** Pass both to drive the select from outside (the range cards do). */
  value?: string;
  onChange?: (value: string) => void;
}) {
  const controlled = value !== undefined;
  return (
    <label className="block">
      <span className="text-sm text-slate">
        {label}
        {required ? "" : " · optional"}
      </span>
      <div className="relative">
        <select
          name={name}
          required={required}
          {...(controlled
            ? { value, onChange: (e) => onChange?.(e.target.value) }
            : { defaultValue })}
          className={`${control} appearance-none pr-10`}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -mt-1 block h-2 w-2 rotate-45 border-b border-r border-ash"
        />
      </div>
    </label>
  );
}

export function TextArea({
  label,
  name,
  placeholder,
  rows = 3,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate">
        {label}
        {required ? "" : " · optional"}
      </span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={`${control} resize-none leading-relaxed`}
      />
    </label>
  );
}

export function Submitted({
  title,
  copy,
  onReset,
  resetLabel = "Send another",
}: {
  title: string;
  copy: string;
  onReset: () => void;
  resetLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-zap-ink/25 bg-zap-wash p-8" role="status">
      <p className="title text-lg text-zap-ink">{title}</p>
      <p className="lead mt-3 text-[0.9375rem]">{copy}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-7 text-sm text-ink underline underline-offset-4 hover:text-zap-ink"
      >
        {resetLabel}
      </button>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p
      role="alert"
      className="rounded-xl border border-flag/25 bg-flag-wash px-4 py-3 text-[0.9375rem] text-flag"
    >
      {message}
    </p>
  );
}

export function SubmitButton({
  children,
  pending,
  className = "",
}: {
  children: ReactNode;
  pending: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-full bg-ink px-7 py-4 text-sm text-paper transition-colors duration-300 hover:bg-zap-ink disabled:opacity-60 ${className}`}
    >
      {pending ? "Sending…" : children}
    </button>
  );
}
