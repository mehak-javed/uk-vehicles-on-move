"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { submitDriverApplication } from "@/app/drive-with-us/actions";
import {
  CheckboxField,
  FileField,
  FormError,
  FormSuccess,
  PrivacyField,
  SelectField,
  SubmitButton,
  TextareaField,
  TextField,
} from "@/components/forms/fields";
import { Turnstile } from "@/components/forms/turnstile";
import { useFormSubmit } from "@/components/forms/use-form-submit";
import { submitWithFiles } from "@/lib/uploads/client";
import { toFileMeta } from "@/lib/validation/common";
import {
  availabilityOptions,
  driverApplicationFormSchema,
  drivingExperience,
  type DriverApplicationFormOutput,
  type DriverApplicationFormValues,
} from "@/lib/validation/driver-application";

type V = DriverApplicationFormValues;

export function DriverApplicationForm() {
  const form = useForm<V, unknown, DriverApplicationFormOutput>({
    resolver: zodResolver(driverApplicationFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      postcode: "",
      about: "",
    },
    mode: "onTouched",
  });
  const { result, error, pending, headingRef, run, captcha } = useFormSubmit();

  if (result) {
    return (
      <FormSuccess
        title="Thank you for applying"
        reference={result.reference}
        headingRef={headingRef}
      >
        We&apos;ll review your application and documents and contact you about
        the next steps.
      </FormSuccess>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((data) =>
          // Files go straight to private storage; only their details
          // and the upload ticket are sent with the form.
          run((token) =>
            submitWithFiles(
              "driver",
              { cv: data.cv, licence: data.licence },
              token,
              (proof) =>
                submitDriverApplication(
                  {
                    ...form.getValues(),
                    cv: toFileMeta(data.cv),
                    licence: toFileMeta(data.licence),
                  },
                  proof,
                ),
            ),
          ),
        )}
        className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <fieldset className="grid gap-6 sm:grid-cols-2">
          <legend className="mb-6 text-2xl font-semibold">About you</legend>
          <TextField<V> name="fullName" label="Full name" autoComplete="name" />
          <TextField<V>
            name="email"
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="email"
          />
          <TextField<V>
            name="phone"
            label="Phone number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
          <TextField<V>
            name="postcode"
            label="Home postcode"
            hint="Helps us offer jobs near you."
            autoComplete="postal-code"
            className="[&_input]:uppercase [&_input]:placeholder:normal-case"
          />
        </fieldset>

        <fieldset className="grid gap-6 sm:grid-cols-2">
          <legend className="mb-6 text-2xl font-semibold">Driving</legend>
          <SelectField<V>
            name="experience"
            label="How long have you held a full UK licence?"
            placeholder="Choose an option"
            options={drivingExperience}
          />
          <SelectField<V>
            name="availability"
            label="Availability"
            placeholder="Choose an option"
            options={availabilityOptions}
          />
          <TextareaField<V>
            name="about"
            label="Tell us about your experience"
            optional
            hint="For example, previous driving or delivery work."
            rows={4}
            className="sm:col-span-2"
          />
        </fieldset>

        <fieldset className="grid gap-6 sm:grid-cols-2">
          <legend className="mb-6 text-2xl font-semibold">Documents</legend>
          <FileField<V> name="cv" label="CV" kind="document" />
          <FileField<V>
            name="licence"
            label="Driving licence"
            hint="A photo or scan of the front of your licence."
            kind="documentOrImage"
          />
        </fieldset>

        <div className="flex flex-col gap-4">
          <CheckboxField<V> name="rightToWork">
            I confirm I have the right to work in the UK.
          </CheckboxField>
          <PrivacyField<V>
            name="privacyAccepted"
            purpose="to assess my application"
          />
        </div>
        <Turnstile {...captcha} />
        <FormError message={error} />
        <SubmitButton pending={pending}>Submit application</SubmitButton>
      </form>
    </FormProvider>
  );
}
