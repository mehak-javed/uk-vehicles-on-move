"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { sendContactMessage } from "@/app/contact/actions";
import {
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
import {
  contactSchema,
  contactSubjects,
  type ContactFormValues,
  type ContactMessage,
} from "@/lib/validation/contact";

type V = ContactFormValues;

export function ContactForm() {
  const form = useForm<V, unknown, ContactMessage>({
    resolver: zodResolver(contactSchema),
    defaultValues: { fullName: "", email: "", phone: "", message: "" },
    mode: "onTouched",
  });
  const { result, error, pending, headingRef, run, captcha } = useFormSubmit();

  if (result) {
    return (
      <FormSuccess
        title="Thank you, your message has been sent"
        reference={result.reference}
        headingRef={headingRef}
      >
        We&apos;ll get back to you as soon as possible.
      </FormSuccess>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(() =>
          run((token) => sendContactMessage(form.getValues(), token)),
        )}
        className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <h2 className="text-2xl font-semibold">Send us a message</h2>
        <div className="grid gap-6 sm:grid-cols-2">
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
            optional
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
          <SelectField<V>
            name="subject"
            label="What is it about?"
            placeholder="Choose a subject"
            options={contactSubjects}
          />
          <TextareaField<V>
            name="message"
            label="Message"
            className="sm:col-span-2"
          />
          <PrivacyField<V>
            name="privacyAccepted"
            purpose="to reply to my message"
          />
        </div>
        <Turnstile {...captcha} />
        <FormError message={error} />
        <SubmitButton pending={pending}>Send message</SubmitButton>
      </form>
    </FormProvider>
  );
}
