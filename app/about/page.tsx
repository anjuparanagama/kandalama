"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useTranslation("aboutUs");
  const offers = t("offers", { returnObjects: true }) as Array<any>;
  const howItWorks = t("howItWorksSteps", {
    returnObjects: true,
  }) as Array<string>;
  const quickActions = t("quickActions", {
    returnObjects: true,
  }) as Array<string>;
  const quickActionsTitle = t("quickActionsTitle");
  const needHelpTitle = t("needHelpTitle");
  const needHelpDescription = t("needHelpDescription");
  const supportEmail = t("supportEmail");
  const supportWhatsApp = t("supportWhatsApp");

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <main
            className="lg:col-span-2"
            role="main"
            aria-labelledby="about-heading"
          >
            <section className="mb-6">
              <h1
                id="about-heading"
                className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3"
              >
                {t("heading")}{" "}
                <span className="text-base">{t("subHeadingSuffix")}</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-700 mb-4 max-w-3xl">
                {t("intro")}
              </p>
              <div className="flex gap-3">
                <Link href="/post-ad" aria-label="Post your property">
                  <Button className="focus:ring-2 focus:ring-offset-2">
                    {t("postYourProperty")}
                  </Button>
                </Link>
                <Link href="/properties" aria-label="Browse properties">
                  <Button className="bg-white text-slate-700 border hover:bg-gray-50 focus:ring-2 focus:ring-offset-2">
                    {t("browseListings")}
                  </Button>
                </Link>
              </div>
            </section>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {t("whatWeOfferTitle")}
                    </h2>
                    <ul className="space-y-3 text-slate-700">
                      {offers.map((offer: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-2xl">{offer.emoji}</span>
                          <div>
                            <div className="font-medium">{offer.title}</div>
                            <div className="text-sm text-slate-600">
                              {offer.desc}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("howItWorksTitle")}
                    </h3>
                    <ol className="list-decimal pl-5 text-slate-700 space-y-2">
                      {howItWorks.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ol>

                    <details className="mt-4 bg-slate-50 p-3 rounded">
                      <summary className="cursor-pointer font-medium">
                        {t("commonQuestionsTitle")}
                      </summary>
                      <div className="mt-2 text-sm text-slate-600 space-y-2">
                        <div>
                          <strong>{t("postingFreeQuestion")}</strong>
                          <div>{t("postingFreeAnswer")}</div>
                        </div>
                        <div>
                          <strong>{t("reportProblemQuestion")}</strong>
                          <div>{t("reportProblemAnswer")}</div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-2">
                    {quickActionsTitle}
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link
                        href="/post-ad"
                        className="text-blue-600 hover:underline"
                        aria-label={quickActions[0]}
                      >
                        {quickActions[0]}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/my-ads"
                        className="text-blue-600 hover:underline"
                        aria-label={quickActions[1]}
                      >
                        {quickActions[1]}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="text-blue-600 hover:underline"
                        aria-label={quickActions[2]}
                      >
                        {quickActions[2]}
                      </Link>
                    </li>
                  </ul>

                  <div className="mt-6 border-t pt-4">
                    <div className="mt-4 bg-white/60 p-4 rounded-lg shadow-sm">
                      <div className="font-semibold text-slate-800 text-lg">
                        {needHelpTitle}
                      </div>

                      <p className="mt-3 text-sm text-slate-700">
                        {needHelpDescription}
                      </p>

                      <div className="mt-3 flex flex-col gap-2">
                        <a
                          href="mailto:Kandalamalk@gmail.com"
                          className="inline-flex items-center gap-3 text-slate-800 hover:text-blue-600"
                          aria-label="Email support"
                        >
                          <span className="text-xl">📧</span>
                          <span className="font-medium">{supportEmail}</span>
                        </a>

                        <a
                          href="https://wa.me/94759066754"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 text-slate-800 hover:text-green-600"
                          aria-label="WhatsApp support"
                        >
                          <span className="text-xl">💬</span>
                          <span className="font-medium">{supportWhatsApp}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
