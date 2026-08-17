"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  className?: string;
};

const fieldClassName = cn(
  "w-full border-0 border-b border-border-strong bg-transparent px-0 py-3.5",
  "text-body-md text-text-primary placeholder:text-text-tertiary",
  "transition-[border-color] duration-300",
  "focus-visible:border-brand-primary focus-visible:outline-none",
);

function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-label-xs text-text-tertiary">
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContactForm({ className }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok) {
        setStatus("error");
        setFormError(result.error ?? "Unable to send your message. Please try again.");
        return;
      }

      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setFormError("Unable to send your message. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("w-full max-w-[38rem]", className)}>
        <p className="type-overline text-text-tertiary">Send a message</p>
        <h2 className="mt-5 font-display text-heading-md text-text-primary">
          Thank you for reaching out.
        </h2>
        <p className="mt-3 max-w-md text-body-md text-text-secondary">
          We received your message and will get back to you as soon as possible.
        </p>
        <div className="mt-8">
          <Button type="button" variant="secondary" size="sm" onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-[38rem]", className)}>
      <p className="type-overline text-text-tertiary">Send a message</p>

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-label="Send a message"
        className="relative mt-7 space-y-8"
      >
        <div className="absolute left-[-9999px]" aria-hidden>
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <FormField id="contact-name" label="Name">
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className={fieldClassName}
              placeholder="Your name"
              disabled={status === "submitting"}
            />
          </FormField>

          <FormField id="contact-email" label="Email">
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClassName}
              placeholder="you@example.com"
              disabled={status === "submitting"}
            />
          </FormField>
        </div>

        <FormField id="contact-subject" label="Subject">
          <input
            id="contact-subject"
            name="subject"
            type="text"
            required
            className={fieldClassName}
            placeholder="What is this regarding?"
            disabled={status === "submitting"}
          />
        </FormField>

        <FormField id="contact-message" label="Message">
          <textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            className={cn(fieldClassName, "min-h-[180px] resize-y")}
            placeholder="Tell us a little about your inquiry…"
            disabled={status === "submitting"}
          />
        </FormField>

        {formError ? (
          <p className="text-body-sm text-text-secondary" role="alert">
            {formError}
          </p>
        ) : null}

        <div>
          <Button type="submit" size="sm" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : "Send message →"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
