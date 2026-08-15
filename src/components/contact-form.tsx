"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

type Status = "idle" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in your name, email, and message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }

    // REPLACE: connect this form to an API route, Resend, or Formspree.
    // Until then, we open a mailto draft as a no-backend fallback.
    const subject = encodeURIComponent(`Fram Forge inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
    setError("");
    form.reset();
  }

  if (status === "sent") {
    return (
      <p
        role="status"
        className="rounded-3xl border border-line bg-steel/40 px-6 py-8 text-sm leading-relaxed text-paper"
      >
        Thanks. Your email app should open with the message. If it does not, write us
        directly at{" "}
        <a className="text-paper underline-offset-2 hover:underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" name="name" label="Name" autoComplete="name" />
        <Field
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
        />
      </div>
      <Field id="message" name="message" label="Message" multiline />
      {status === "error" ? (
        <p role="alert" className="text-sm text-paper">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-paper px-5 py-3 text-sm font-medium text-obsidian transition-colors hover:bg-mist sm:w-auto"
      >
        Send message
      </button>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  multiline,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
}) {
  const className =
    "mt-2 w-full rounded-2xl border border-line bg-obsidian px-4 py-3 text-sm text-paper placeholder:text-ash/80 transition-colors focus:border-paper/40";

  return (
    <div>
      <label htmlFor={id} className="text-sm text-mist">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required
          placeholder="What are you working on?"
          className={`${className} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required
          autoComplete={autoComplete}
          className={className}
        />
      )}
    </div>
  );
}
