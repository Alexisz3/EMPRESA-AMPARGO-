import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import { Container } from "../ui/container";

const contacts = [
  { name: "Joe Andrade", phone: "(832) 794-0720", tel: "+18327940720", whatsapp: "18327940720" },
  { name: "Mario Parra", phone: "(832) 652-4660", tel: "+18326524660", whatsapp: "18326524660" },
] as const;

export async function ContactPageContent() {
  const t = await getTranslations("ContactPage");
  return (
    <>
      <section className="bg-foreground py-16 text-background sm:py-24 lg:py-28">
        <Container>
          <div data-reveal="hero">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d18a62]">{t("hero.eyebrow")}</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end lg:gap-20">
            <h1 className="max-w-4xl text-[clamp(2.65rem,11.5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{t("hero.title")}</h1>
            <p className="max-w-xl text-lg leading-8 text-white/70 sm:text-xl">{t("hero.description")}</p>
          </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div data-reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{t("details.eyebrow")}</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{t("details.title")}</h2>
              <div data-reveal-group className="mt-8 grid gap-4 sm:mt-10 sm:gap-5">
                {contacts.map((contact) => (
                  <article key={contact.name} data-reveal className="rounded-[1.5rem] border border-black/10 bg-surface p-5 sm:p-7">
                    <h3 className="text-xl font-semibold">{contact.name}</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <a href={`tel:${contact.tel}`} className="motion-button inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-5 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto">{contact.phone}</a>
                      <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" className="motion-button inline-flex min-h-12 w-full items-center justify-center rounded-full border border-black/20 px-5 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto">{t("details.whatsapp")}</a>
                    </div>
                  </article>
                ))}
              </div>
              <dl className="mt-8 grid gap-6 border-t border-black/15 pt-8 sm:grid-cols-2">
                <div><dt className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">{t("details.serviceArea")}</dt><dd className="mt-2 text-lg font-medium">Houston, Texas</dd></div>
                <div><dt className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">{t("details.address")}</dt><dd className="mt-2 text-lg font-medium">8027 Burning Hills Dr<br />Houston, TX 77075</dd></div>
              </dl>
              <Link href="/quote" className="motion-button mt-9 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-7 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:w-auto">{t("cta")}</Link>
            </div>

            <div data-reveal="image" className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#e8e2d8]">
              <iframe title={t("map.title")} src="https://www.google.com/maps?q=8027%20Burning%20Hills%20Dr%2C%20Houston%2C%20TX%2077075&output=embed" className="h-[360px] w-full border-0 sm:h-[480px] lg:h-full lg:min-h-[680px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              <p className="border-t border-black/10 bg-surface px-6 py-4 text-sm leading-6 text-muted">{t("map.note")}</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
