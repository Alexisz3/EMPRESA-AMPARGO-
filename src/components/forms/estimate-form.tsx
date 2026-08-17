"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { PROJECT_TYPES, type QuoteErrors, validateQuoteFields, validateQuoteFiles } from "@/lib/quote-validation";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 text-base text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";
const labelClass = "block text-sm font-semibold text-foreground";

export function EstimateForm() {
  const t = useTranslations("QuotePage.form");
  const [formStartedAt] = useState(() => Date.now().toString());
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusCode, setStatusCode] = useState<string>("");

  const errorMessage = (field: keyof QuoteErrors) => {
    const code = errors[field];
    return code ? t(`errors.${code}`) : "";
  };

  const clearError = (field: keyof QuoteErrors) => {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    const { errors: fieldErrors } = validateQuoteFields(Object.fromEntries(formData.entries()));
    const nextErrors = { ...fieldErrors, ...validateQuoteFiles(files) };

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setStatusCode("validation");
      const firstError = Object.keys(nextErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("loading");
    setStatusCode("");

    try {
      const response = await fetch("/api/quote", { method: "POST", body: formData });
      const result = await response.json() as { code?: string; errors?: QuoteErrors };
      if (response.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (result.errors) setErrors(result.errors);
      setStatus("error");
      setStatusCode(result.code === "DELIVERY_NOT_CONFIGURED" ? "notConfigured" : result.code === "SUBMISSION_TOO_FAST" ? "tooFast" : result.code === "VALIDATION_ERROR" ? "validation" : "delivery");
    } catch {
      setStatus("error");
      setStatusCode("delivery");
    }
  }

  const fieldError = (field: keyof QuoteErrors) => errors[field] ? (
    <p id={`${field}-error`} className="mt-2 text-sm font-medium text-red-700">{errorMessage(field)}</p>
  ) : null;

  return (
    <form data-reveal noValidate onSubmit={handleSubmit} className="rounded-[1.5rem] border border-black/10 bg-surface p-5 shadow-[0_24px_70px_rgba(29,37,34,0.08)] sm:rounded-[2rem] sm:p-10">
      <div className="absolute -left-[10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="formStartedAt" value={formStartedAt} />
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="fullName">{t("fields.fullName")} <span className="text-accent" aria-hidden="true">*</span></label>
          <input className={inputClass} id="fullName" name="fullName" autoComplete="name" required maxLength={100} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined} onChange={() => clearError("fullName")} />
          {fieldError("fullName")}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">{t("fields.phone")} <span className="text-accent" aria-hidden="true">*</span></label>
          <input className={inputClass} id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={40} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} onChange={() => clearError("phone")} />
          {fieldError("phone")}
        </div>
        <div>
          <label className={labelClass} htmlFor="email">{t("fields.email")} <span className="text-accent" aria-hidden="true">*</span></label>
          <input className={inputClass} id="email" name="email" type="email" inputMode="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={() => clearError("email")} />
          {fieldError("email")}
        </div>
        <div>
          <label className={labelClass} htmlFor="address">{t("fields.address")}</label>
          <input className={inputClass} id="address" name="address" autoComplete="street-address postal-code" maxLength={200} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? "address-error" : undefined} onChange={() => clearError("address")} />
          {fieldError("address")}
        </div>
        <div>
          <label className={labelClass} htmlFor="projectType">{t("fields.projectType")} <span className="text-accent" aria-hidden="true">*</span></label>
          <select className={inputClass} id="projectType" name="projectType" required defaultValue="" aria-invalid={Boolean(errors.projectType)} aria-describedby={errors.projectType ? "projectType-error" : undefined} onChange={() => clearError("projectType")}>
            <option value="" disabled>{t("selectPlaceholder")}</option>
            {PROJECT_TYPES.map((type) => <option key={type} value={type}>{t(`projectTypes.${type}`)}</option>)}
          </select>
          {fieldError("projectType")}
        </div>
        <div>
          <label className={labelClass} htmlFor="budget">{t("fields.budget")}</label>
          <input className={inputClass} id="budget" name="budget" inputMode="decimal" maxLength={100} placeholder={t("budgetPlaceholder")} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? "budget-error" : undefined} onChange={() => clearError("budget")} />
          {fieldError("budget")}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="desiredStartDate">{t("fields.desiredStartDate")}</label>
          <input className={`${inputClass} sm:max-w-sm`} id="desiredStartDate" name="desiredStartDate" type="date" aria-invalid={Boolean(errors.desiredStartDate)} aria-describedby={errors.desiredStartDate ? "desiredStartDate-error" : undefined} onChange={() => clearError("desiredStartDate")} />
          {fieldError("desiredStartDate")}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="description">{t("fields.description")} <span className="text-accent" aria-hidden="true">*</span></label>
          <textarea className={`${inputClass} min-h-40 resize-y py-3`} id="description" name="description" required minLength={20} maxLength={3000} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "description-error" : "description-help"} onChange={() => clearError("description")} />
          <p id="description-help" className="mt-2 text-sm text-muted">{t("descriptionHelp")}</p>
          {fieldError("description")}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="files">{t("fields.files")}</label>
          <input className="mt-2 block min-h-12 w-full cursor-pointer rounded-xl border border-dashed border-black/20 bg-background px-3 py-3 text-base file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent sm:px-4" id="files" name="files" type="file" multiple accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" aria-invalid={Boolean(errors.files)} aria-describedby={errors.files ? "files-error" : "files-help"} onChange={() => clearError("files")} />
          <p id="files-help" className="mt-2 text-sm leading-6 text-muted">{t("fileHelp")}</p>
          {fieldError("files")}
        </div>
      </div>

      <p className="mt-7 text-sm leading-6 text-muted">{t.rich("privacyNote", { privacy: (chunks) => <Link href="/privacy" className="font-semibold text-foreground underline underline-offset-4">{chunks}</Link> })}</p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "loading"} className="motion-button inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-8 text-base font-semibold text-white hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent sm:w-auto">
          {status === "loading" ? t("submitting") : t("submit")}
        </button>
        <p className="text-sm text-muted"><span className="text-accent" aria-hidden="true">*</span> {t("requiredNote")}</p>
      </div>

      <div className="mt-6" aria-live="polite" aria-atomic="true">
        {status === "success" ? <p className="rounded-xl border border-green-700/20 bg-green-50 p-4 font-medium text-green-800">{t("status.success")}</p> : null}
        {status === "error" ? <p className="rounded-xl border border-red-700/20 bg-red-50 p-4 font-medium text-red-800">{t(`status.${statusCode || "delivery"}`)}</p> : null}
      </div>
    </form>
  );
}
