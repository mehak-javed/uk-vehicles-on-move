"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  useForm,
  useWatch,
  type FieldPath,
  type UseFormRegisterReturn,
} from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
  Pencil,
} from "lucide-react";

import { submitQuote } from "@/app/quote/actions";
import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  quoteRequestSchema,
  quoteSteps,
  todayInUk,
  vehicleTypes,
  type QuoteFormValues,
  type QuoteRequest,
} from "@/lib/validation/quote";

type FieldName = FieldPath<QuoteFormValues>;

const defaultValues: Partial<QuoteFormValues> = {
  make: "",
  model: "",
  registration: "",
  collectionPostcode: "",
  deliveryPostcode: "",
  preferredDate: "",
  dateFlexible: false,
  notes: "",
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
};

export function QuoteForm() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const form = useForm<QuoteFormValues, unknown, QuoteRequest>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues,
    mode: "onTouched",
  });
  const {
    register,
    control,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = form;

  // Live values for the review step and the conditional company field.
  const v = useWatch({ control }) as QuoteFormValues;

  // On the review step everything is valid, so show the cleaned-up values
  // (e.g. "SW1A 1AA", "AB12 CDE") exactly as they will be sent.
  const parsed = step === 3 ? quoteRequestSchema.safeParse(v) : null;
  const clean = parsed?.success ? parsed.data : null;

  // Move focus to the step heading when the step changes, so keyboard and
  // screen-reader users start at the top of the new step.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, result]);

  const isLast = step === quoteSteps.length - 1;

  async function next() {
    const fields = quoteSteps[step].fields as readonly FieldName[];
    const valid = await trigger(fields);
    if (valid) {
      setStep((s) => s + 1);
      return;
    }
    // Put the cursor in the first field that needs fixing.
    const firstInvalid = fields.find((f) => form.getFieldState(f).invalid);
    if (firstInvalid) form.setFocus(firstInvalid);
  }

  // Runs only after the whole form passes validation in the browser.
  const onSubmit = handleSubmit(() => {
    setServerError(null);
    startTransition(async () => {
      // Send the raw form values: the server validates them again.
      const res = await submitQuote(getValues());
      if (res.ok) setResult({ reference: res.reference });
      else setServerError(res.message);
    });
  });

  // Helpers so every field gets a label, error message and ARIA wiring.
  const err = (name: FieldName) => errors[name]?.message as string | undefined;
  const describedBy = (name: FieldName, hint?: boolean) =>
    [hint && `${name}-hint`, err(name) && `${name}-error`]
      .filter(Boolean)
      .join(" ") || undefined;

  function TextField({
    name,
    label,
    hint,
    optional,
    reg,
    ...inputProps
  }: {
    name: FieldName;
    label: string;
    hint?: string;
    optional?: boolean;
    reg: UseFormRegisterReturn;
  } & Omit<React.ComponentProps<"input">, "name">) {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor={name}>
          {label}
          {optional && (
            <span className="font-normal text-muted-foreground">
              {" "}
              (optional)
            </span>
          )}
        </Label>
        {hint && (
          <p
            id={`${name}-hint`}
            className="-mt-1 text-sm text-muted-foreground"
          >
            {hint}
          </p>
        )}
        <Input
          id={name}
          aria-invalid={err(name) ? true : undefined}
          aria-describedby={describedBy(name, Boolean(hint))}
          className="h-11 bg-card"
          {...inputProps}
          {...reg}
        />
        <FieldError id={`${name}-error`} message={err(name)} />
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
        <CheckCircle2 className="size-14 text-gold-dark" aria-hidden="true" />
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="text-3xl font-semibold outline-none"
        >
          Thank you, your quote request has been sent
        </h2>
        <p className="max-w-md text-lg text-muted-foreground">
          Your reference is{" "}
          <strong className="font-mono text-foreground">
            {result.reference}
          </strong>
          . We&apos;ll review the details and get back to you with a price as
          soon as possible.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="px-5">
            <Link href="/">Back to home</Link>
          </Button>
          {siteConfig.contact.phone && (
            <Button asChild variant="outline" size="lg" className="px-5">
              <a href={siteConfig.contact.phone.href}>
                Call {siteConfig.contact.phone.label}
              </a>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast) void onSubmit(e);
        else void next();
      }}
      className="flex flex-col gap-8"
    >
      {/* Progress indicator */}
      <nav aria-label="Quote progress">
        <ol className="grid grid-cols-4 gap-2">
          {quoteSteps.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li
                key={s.title}
                aria-current={current ? "step" : undefined}
                className="flex flex-col gap-2"
              >
                <span
                  className={cn(
                    "h-1.5 rounded-full",
                    done || current ? "bg-gold" : "bg-border",
                  )}
                />
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium sm:text-sm",
                    current ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {done && (
                    <Check
                      className="size-3.5 text-gold-dark"
                      aria-hidden="true"
                    />
                  )}
                  <span className="sr-only">
                    Step {i + 1}
                    {done ? " (completed)" : ""}:{" "}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden" aria-hidden="true">
                    {i + 1}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Step {step + 1} of {quoteSteps.length}
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-semibold outline-none sm:text-3xl"
          >
            {
              [
                "Tell us about the vehicle",
                "Where and when?",
                "Your contact details",
                "Check your details",
              ][step]
            }
          </h2>
        </div>

        {/* Step 1: vehicle */}
        {step === 0 && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="vehicleType">Vehicle type</Label>
              <Controller
                control={control}
                name="vehicleType"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="vehicleType"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      aria-invalid={err("vehicleType") ? true : undefined}
                      aria-describedby={describedBy("vehicleType")}
                      className="h-11 w-full bg-card"
                    >
                      <SelectValue placeholder="Select a vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError id="vehicleType-error" message={err("vehicleType")} />
            </div>
            {TextField({
              name: "make",
              label: "Make",
              placeholder: "e.g. Ford",
              autoComplete: "off",
              reg: register("make"),
            })}
            {TextField({
              name: "model",
              label: "Model",
              placeholder: "e.g. Focus",
              autoComplete: "off",
              reg: register("model"),
            })}
            {TextField({
              name: "registration",
              label: "Registration number",
              optional: true,
              placeholder: "e.g. AB12 CDE",
              autoComplete: "off",
              className: "h-11 bg-card uppercase placeholder:normal-case",
              reg: register("registration"),
            })}
            <fieldset className="flex flex-col gap-3 sm:col-span-2">
              <legend id="driveable-label" className="mb-3 text-sm font-medium">
                Can the vehicle be driven?
              </legend>
              <Controller
                control={control}
                name="driveable"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    aria-labelledby="driveable-label"
                    aria-invalid={err("driveable") ? true : undefined}
                    aria-describedby={describedBy("driveable")}
                    className="flex gap-6"
                  >
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No, it needs transporting" },
                    ].map((o) => (
                      <div key={o.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          id={`driveable-${o.value}`}
                          value={o.value}
                          ref={o.value === "yes" ? field.ref : undefined}
                        />
                        <Label
                          htmlFor={`driveable-${o.value}`}
                          className="font-normal"
                        >
                          {o.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              <FieldError id="driveable-error" message={err("driveable")} />
            </fieldset>
          </div>
        )}

        {/* Step 2: route and date */}
        {step === 1 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {TextField({
              name: "collectionPostcode",
              label: "Collection postcode",
              placeholder: "e.g. M1 1AE",
              autoComplete: "postal-code",
              className: "h-11 bg-card uppercase placeholder:normal-case",
              reg: register("collectionPostcode"),
            })}
            {TextField({
              name: "deliveryPostcode",
              label: "Delivery postcode",
              placeholder: "e.g. SW1A 1AA",
              autoComplete: "off",
              className: "h-11 bg-card uppercase placeholder:normal-case",
              reg: register("deliveryPostcode"),
            })}
            {TextField({
              name: "preferredDate",
              label: "Preferred collection date",
              type: "date",
              min: todayInUk(),
              reg: register("preferredDate"),
            })}
            <div className="flex items-end pb-3">
              <Controller
                control={control}
                name="dateFlexible"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="dateFlexible"
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={(c) => field.onChange(c === true)}
                    />
                    <Label htmlFor="dateFlexible" className="font-normal">
                      My dates are flexible
                    </Label>
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="notes">
                Anything else we should know?
                <span className="font-normal text-muted-foreground">
                  {" "}
                  (optional)
                </span>
              </Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="e.g. access restrictions, keys, preferred times"
                aria-invalid={err("notes") ? true : undefined}
                aria-describedby={describedBy("notes")}
                className="bg-card"
                {...register("notes")}
              />
              <FieldError id="notes-error" message={err("notes")} />
            </div>
          </div>
        )}

        {/* Step 3: contact details */}
        {step === 2 && (
          <div className="grid gap-6 sm:grid-cols-2">
            {TextField({
              name: "fullName",
              label: "Full name",
              autoComplete: "name",
              reg: register("fullName"),
            })}
            {TextField({
              name: "email",
              label: "Email address",
              type: "email",
              autoComplete: "email",
              inputMode: "email",
              reg: register("email"),
            })}
            {TextField({
              name: "phone",
              label: "Phone number",
              type: "tel",
              autoComplete: "tel",
              inputMode: "tel",
              hint: "We'll only call about your quote.",
              reg: register("phone"),
            })}
            <fieldset className="flex flex-col gap-3">
              <legend
                id="customerType-label"
                className="mb-3 text-sm font-medium"
              >
                Are you a…
              </legend>
              <Controller
                control={control}
                name="customerType"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    aria-labelledby="customerType-label"
                    aria-invalid={err("customerType") ? true : undefined}
                    aria-describedby={describedBy("customerType")}
                    className="flex gap-6"
                  >
                    {[
                      { value: "private", label: "Private customer" },
                      { value: "trade", label: "Trade / business" },
                    ].map((o) => (
                      <div key={o.value} className="flex items-center gap-2">
                        <RadioGroupItem
                          id={`customerType-${o.value}`}
                          value={o.value}
                          ref={o.value === "private" ? field.ref : undefined}
                        />
                        <Label
                          htmlFor={`customerType-${o.value}`}
                          className="font-normal"
                        >
                          {o.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              <FieldError
                id="customerType-error"
                message={err("customerType")}
              />
            </fieldset>
            {v.customerType === "trade" &&
              TextField({
                name: "companyName",
                label: "Company name",
                optional: true,
                autoComplete: "organization",
                reg: register("companyName"),
              })}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Controller
                control={control}
                name="privacyAccepted"
                render={({ field }) => (
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="privacyAccepted"
                      ref={field.ref}
                      checked={field.value === true}
                      onCheckedChange={(c) => field.onChange(c === true)}
                      onBlur={field.onBlur}
                      aria-labelledby="privacyAccepted-label"
                      aria-invalid={err("privacyAccepted") ? true : undefined}
                      aria-describedby={describedBy("privacyAccepted")}
                      className="mt-0.5"
                    />
                    <Label
                      id="privacyAccepted-label"
                      htmlFor="privacyAccepted"
                      className="leading-snug font-normal"
                    >
                      <span>
                        I agree that my details will be used to prepare my
                        quote, as described in the{" "}
                        <Link
                          href="/privacy"
                          className="font-medium text-gold-dark underline underline-offset-4"
                        >
                          privacy policy
                        </Link>
                        .
                      </span>
                    </Label>
                  </div>
                )}
              />
              <FieldError
                id="privacyAccepted-error"
                message={err("privacyAccepted")}
              />
            </div>
          </div>
        )}

        {/* Step 4: review */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            {[
              {
                step: 0,
                title: "Vehicle",
                rows: [
                  [
                    "Type",
                    vehicleTypes.find((t) => t.value === v.vehicleType)?.label,
                  ],
                  ["Make and model", `${v.make} ${v.model}`],
                  ["Registration", clean?.registration || "Not given"],
                  ["Driveable", v.driveable === "yes" ? "Yes" : "No"],
                ],
              },
              {
                step: 1,
                title: "Route & date",
                rows: [
                  ["Collection", clean?.collectionPostcode],
                  ["Delivery", clean?.deliveryPostcode],
                  [
                    "Date",
                    `${formatDate(v.preferredDate)}${v.dateFlexible ? " (flexible)" : ""}`,
                  ],
                  ...(v.notes ? [["Notes", v.notes]] : []),
                ],
              },
              {
                step: 2,
                title: "Contact details",
                rows: [
                  ["Name", v.fullName],
                  ["Email", v.email],
                  ["Phone", v.phone],
                  [
                    "Customer",
                    v.customerType === "trade"
                      ? `Trade${v.companyName ? ` (${v.companyName})` : ""}`
                      : "Private",
                  ],
                ],
              },
            ].map((section) => (
              <section
                key={section.title}
                aria-labelledby={`review-${section.step}`}
                className="rounded-xl border border-border"
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <h3
                    id={`review-${section.step}`}
                    className="font-sans text-base font-semibold"
                  >
                    {section.title}
                  </h3>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setStep(section.step)}
                    className="text-gold-dark"
                  >
                    <Pencil data-icon="inline-start" aria-hidden="true" />
                    Change
                    <span className="sr-only">
                      {" "}
                      {section.title.toLowerCase()}
                    </span>
                  </Button>
                </div>
                <dl className="grid gap-x-6 gap-y-2 px-5 py-4 sm:grid-cols-[10rem_1fr]">
                  {section.rows.map(([k, val]) => (
                    <div key={k} className="contents">
                      <dt className="text-sm text-muted-foreground">{k}</dt>
                      <dd className="break-words">{val}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
            {serverError && (
              <p
                role="alert"
                className="rounded-lg bg-destructive/10 p-4 text-destructive"
              >
                {serverError}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              size="xl"
              onClick={() => setStep((s) => s - 1)}
              disabled={pending}
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" variant="accent" size="xl" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : isLast ? (
              "Send quote request"
            ) : (
              <>
                Continue
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
        <p aria-live="polite" className="sr-only">
          {pending ? "Sending your quote request" : ""}
        </p>
      </div>
    </form>
  );
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
