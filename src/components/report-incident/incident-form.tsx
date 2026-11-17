"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { submitIncidentReport } from "@/app/report-incident/actions";
import {
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
import { useTodayInUk } from "@/components/forms/use-today";
import { toFileMeta } from "@/lib/validation/common";
import {
  incidentFormSchema,
  incidentTypes,
  MAX_INCIDENT_PHOTOS,
  type IncidentFormOutput,
  type IncidentFormValues,
} from "@/lib/validation/incident";

type V = IncidentFormValues;

export function IncidentForm() {
  const form = useForm<V, unknown, IncidentFormOutput>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      jobReference: "",
      incidentDate: "",
      location: "",
      vehicleRegistration: "",
      description: "",
    },
    mode: "onTouched",
  });
  const { result, error, pending, headingRef, run, captcha } = useFormSubmit();
  const today = useTodayInUk();

  if (result) {
    return (
      <FormSuccess
        title="Thank you, your report has been received"
        reference={result.reference}
        headingRef={headingRef}
      >
        Please keep this reference. A member of our team will contact you about
        the incident.
      </FormSuccess>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((data) =>
          // Photos go straight to private storage; only their details
          // and the upload ticket are sent with the form.
          run((token) =>
            submitWithFiles(
              "incident",
              { photos: data.photos },
              token,
              (proof) =>
                submitIncidentReport(
                  { ...form.getValues(), photos: toFileMeta(data.photos) },
                  proof,
                ),
            ),
          ),
        )}
        className="flex flex-col gap-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <fieldset className="grid gap-6 sm:grid-cols-2">
          <legend className="mb-6 text-2xl font-semibold">What happened</legend>
          <SelectField<V>
            name="incidentType"
            label="Type of incident"
            placeholder="Choose the type of incident"
            options={incidentTypes}
          />
          <TextField<V>
            name="incidentDate"
            label="Date of the incident"
            type="date"
            max={today}
          />
          <TextField<V>
            name="location"
            label="Where did it happen?"
            hint="A road, town or postcode."
            className="sm:col-span-2"
          />
          <TextField<V>
            name="jobReference"
            label="Job or booking reference"
            optional
            placeholder="e.g. UVM-7K3QH2"
            autoComplete="off"
          />
          <TextField<V>
            name="vehicleRegistration"
            label="Vehicle registration"
            optional
            placeholder="e.g. AB12 CDE"
            autoComplete="off"
          />
          <TextareaField<V>
            name="description"
            label="Describe what happened"
            hint="Include anything that will help us understand the incident."
            rows={6}
            className="sm:col-span-2"
          />
          <FileField<V>
            name="photos"
            label="Photos"
            optional
            hint={`Up to ${MAX_INCIDENT_PHOTOS} photos.`}
            kind="image"
            multiple
            className="sm:col-span-2"
          />
        </fieldset>

        <fieldset className="grid gap-6 sm:grid-cols-2">
          <legend className="mb-6 text-2xl font-semibold">Your details</legend>
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
        </fieldset>

        <PrivacyField<V>
          name="privacyAccepted"
          purpose="to look into this incident"
        />
        <Turnstile {...captcha} />
        <FormError message={error} />
        <SubmitButton pending={pending}>Send report</SubmitButton>
      </form>
    </FormProvider>
  );
}
