import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <>
      <Header />
      <main className="bg-foreground py-24 text-background sm:py-32 lg:py-40">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-on-dark">AMPARGO · 404</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{t("title")}</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">{t("description")}</p>
          <Link href="/" className="mt-9 inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{t("home")}</Link>
        </Container>
      </main>
      <Footer />
    </>
  );
}
