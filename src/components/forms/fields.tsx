"use client";

import Link from "next/link";
import { CheckCircle2, FileText, Loader2 } from "lucide-react";
import {
  Controller,
  get,
  useFormContext,
  useWatch,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { FieldError } from "@/components/forms/field-error";
import { FileInput } from "@/components/forms/file-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  acceptFor,
  fileKinds,
  MAX_FILE_MB,
  type FileKind,
} from "@/lib/validation/common";

/*
 * Form fields wired to React Hook Form (via <FormProvider>). Each one has a
 * visible label, optional hint, and an inline error that is linked with
 * aria-describedby and announced to screen readers (role="alert").
 */

function useFieldError(name: string) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name) as { message?: string } | undefined;
  return error?.message;
}

const describedBy = (name: string, hint?: boolean, error?: string) =>
  [hint && `${name}-hint`, error && `${name}-error`]
    .filter(Boolean)
    .join(" ") || undefined;

function FieldLabel({
  htmlFor,
  label,
  optional,
  id,
}: {
  htmlFor: string;
  label: string;
  optional?: boolean;
  id?: string;
}) {
  return (
    <Label htmlFor={htmlFor} id={id}>
      {label}
      {optional && (
        <span className="font-normal text-muted-foreground"> (optional)</span>
      )}
    </Label>
  );
}

function Hint({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <p id={`${name}-hint`} className="-mt-1 text-sm text-muted-foreground">
      {children}
    </p>
  );
}

type BaseProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

export function TextField<T extends FieldValues>({
  name,
  label,
  hint,
  optional,
  className,
  ...inputProps
}: BaseProps<T> & Omit<React.ComponentProps<"input">, "name">) {
  const { register } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={name} label={label} optional={optional} />
      {hint && <Hint name={name}>{hint}</Hint>}
      <Input
        id={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, Boolean(hint), error)}
        className="h-11 bg-card"
        {...inputProps}
        {...register(name)}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

export function TextareaField<T extends FieldValues>({
  name,
  label,
  hint,
  optional,
  className,
  ...props
}: BaseProps<T> & Omit<React.ComponentProps<"textarea">, "name">) {
  const { register } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={name} label={label} optional={optional} />
      {hint && <Hint name={name}>{hint}</Hint>}
      <Textarea
        id={name}
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, Boolean(hint), error)}
        className="bg-card"
        {...props}
        {...register(name)}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  hint,
  className,
  placeholder,
  options,
}: BaseProps<T> & {
  placeholder: string;
  options: readonly { value: string; label: string }[];
}) {
  const { control } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={name} label={label} />
      {hint && <Hint name={name}>{hint}</Hint>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger
              id={name}
              ref={field.ref}
              onBlur={field.onBlur}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(name, Boolean(hint), error)}
              className="h-11 w-full bg-card"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

/** A required tick box, e.g. privacy policy or right-to-work confirmation. */
export function CheckboxField<T extends FieldValues>({
  name,
  children,
  className,
}: {
  name: Path<T>;
  children: React.ReactNode;
  className?: string;
}) {
  const { control } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox
              id={name}
              ref={field.ref}
              checked={field.value === true}
              onCheckedChange={(c) => field.onChange(c === true)}
              onBlur={field.onBlur}
              aria-labelledby={`${name}-label`}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy(name, false, error)}
              className="mt-0.5"
            />
            <Label
              id={`${name}-label`}
              htmlFor={name}
              className="leading-snug font-normal"
            >
              <span>{children}</span>
            </Label>
          </div>
        )}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

export function PrivacyField<T extends FieldValues>({
  name,
  purpose,
}: {
  name: Path<T>;
  /** e.g. "to reply to my message" */
  purpose: string;
}) {
  return (
    <CheckboxField name={name}>
      I agree that my details will be used {purpose}, as described in the{" "}
      <Link
        href="/privacy"
        className="font-medium text-gold-dark underline underline-offset-4"
      >
        privacy policy
      </Link>
      .
    </CheckboxField>
  );
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function FileField<T extends FieldValues>({
  name,
  label,
  hint,
  optional,
  className,
  kind,
  multiple,
}: BaseProps<T> & { kind: FileKind; multiple?: boolean }) {
  const { register, control } = useFormContext<T>();
  const error = useFieldError(name);
  const value = useWatch({ control, name }) as FileList | undefined;
  const files = value ? Array.from(value) : [];
  const rules = `${fileKinds[kind].label}, up to ${MAX_FILE_MB} MB${multiple ? " each" : ""}.`;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <FieldLabel htmlFor={name} label={label} optional={optional} />
      <Hint name={name}>
        {hint ? `${hint} ` : ""}
        {rules}
      </Hint>
      <FileInput
        id={name}
        accept={acceptFor(kind)}
        multiple={multiple}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, true, error)}
        className="bg-card"
        {...register(name)}
      />
      {files.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm" aria-label="Chosen files">
          {files.map((f) => (
            <li key={`${f.name}-${f.size}`} className="flex items-center gap-2">
              <FileText
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate">{f.name}</span>
              <span className="shrink-0 text-muted-foreground">
                {formatSize(f.size)}
              </span>
            </li>
          ))}
        </ul>
      )}
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <>
      <Button
        type="submit"
        variant="accent"
        size="xl"
        disabled={pending}
        className="w-full sm:w-fit"
      >
        {pending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          children
        )}
      </Button>
      <p aria-live="polite" className="sr-only">
        {pending ? "Sending" : ""}
      </p>
    </>
  );
}

/** Shown in place of the form after a successful submission. */
export function FormSuccess({
  title,
  reference,
  children,
  headingRef,
}: {
  title: string;
  reference?: string;
  children: React.ReactNode;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
      <CheckCircle2 className="size-14 text-gold-dark" aria-hidden="true" />
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="text-3xl font-semibold outline-none"
      >
        {title}
      </h2>
      {reference && (
        <p className="text-lg">
          Your reference is <strong className="font-mono">{reference}</strong>
        </p>
      )}
      <div className="max-w-md text-lg text-muted-foreground">{children}</div>
      <Button asChild size="lg" className="px-5">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}

/** Error from the server, e.g. if validation failed there. */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-destructive/10 p-4 text-destructive"
    >
      {message}
    </p>
  );
}
