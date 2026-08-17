import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

const sections = ["information", "use", "sharing", "security", "retention", "analytics", "choices", "changes"] as const;

export async function PrivacyPageContent() {
  const t = await getTranslations("PrivacyPage");
  return (
    <>
      <section className="bg-foreground py-20 text-background sm:py-24">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d18a62]">{t("hero.eyebrow")}</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{t("hero.title")}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">{t("hero.description")}</p>
        </Container>
      </section>
      <section className="py-16 sm:py-20 lg:py-28">
        <Container className="max-w-4xl">
          <p className="rounded-2xl border border-accent/20 bg-[#efe4da] p-5 leading-7 text-foreground">{t("notice")}</p>
          <div className="mt-12 grid gap-12">
            {sections.map((section) => (
              <section key={section} aria-labelledby={`privacy-${section}`} className="border-t border-black/15 pt-8">
                <h2 id={`privacy-${section}`} className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">{t(`sections.${section}.title`)}</h2>
                <p className="mt-4 text-lg leading-8 text-muted">{t(`sections.${section}.body`)}</p>
              </section>
            ))}
          </div>
          <div className="mt-14 rounded-[1.5rem] bg-foreground p-7 text-white sm:p-10">
            <h2 className="text-3xl font-semibold">{t("contact.title")}</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">{t("contact.body")}</p>
            <Link href="/contact" className="mt-7 inline-flex min-h-11 items-center rounded-full bg-accent px-6 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{t("contact.cta")}</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
