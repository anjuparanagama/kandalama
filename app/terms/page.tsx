"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const lastUpdated = "19 February 2026";
  const { t } = useTranslation("terms");

  return (
    <div className="bg-gray-50 scroll-smooth">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <svg
                className="w-7 h-7 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 11.5L12 3l9 8.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("title")}
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl">
              {t("subtitle")}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t("lastUpdated", { date: lastUpdated })}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <main className="lg:col-span-3">
            <Card className="shadow-lg ring-1 ring-slate-100">
              <CardContent className="p-6">
                <section id="summary" className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
                      ✓
                    </span>
                    {t("quickSummary.title")}
                  </h2>
                  <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 p-4 rounded-lg">
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                      <li>{t("quickSummary.item1")}</li>
                      <li>{t("quickSummary.item2")}</li>
                      <li>{t("quickSummary.item3")}</li>
                    </ul>
                  </div>
                </section>

                <article className="prose prose-sm sm:prose lg:prose-lg space-y-6 sm:space-y-8">
                  <h3
                    id="using-the-site"
                    className="text-lg sm:text-xl flex items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-800"
                    >
                      📌
                    </span>
                    <span>{t("sections.usingSite.title")}</span>
                  </h3>
                  <p className="text-slate-700">
                    {t("sections.usingSite.text")}
                  </p>

                  <h3
                    id="posting-listings"
                    className="text-lg sm:text-xl flex items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800"
                    >
                      🏷️
                    </span>
                    <span>{t("sections.postingListings.title")}</span>
                  </h3>
                  <p className="text-slate-700">
                    {t("sections.postingListings.text")}
                  </p>

                  <h3
                    id="safety-tips"
                    className="text-lg sm:text-xl flex items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800"
                    >
                      🛡️
                    </span>
                    <span>{t("sections.safetyTips.title")}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-md border p-3 bg-white/60">
                      <strong className="block text-sm">
                        {t("sections.safetyTips.card1Title")}
                      </strong>
                      <p className="text-sm text-slate-600">
                        {t("sections.safetyTips.card1Desc")}
                      </p>
                    </div>
                    <div className="rounded-md border p-3 bg-white/60">
                      <strong className="block text-sm">
                        {t("sections.safetyTips.card2Title")}
                      </strong>
                      <p className="text-sm text-slate-600">
                        {t("sections.safetyTips.card2Desc")}
                      </p>
                    </div>
                    <div className="rounded-md border p-3 bg-white/60">
                      <strong className="block text-sm">
                        {t("sections.safetyTips.card3Title")}
                      </strong>
                      <p className="text-sm text-slate-600">
                        {t("sections.safetyTips.card3Desc")}
                      </p>
                    </div>
                    <div className="rounded-md border p-3 bg-white/60">
                      <strong className="block text-sm">
                        {t("sections.safetyTips.card4Title")}
                      </strong>
                      <p className="text-sm text-slate-600">
                        {t("sections.safetyTips.card4Desc")}
                      </p>
                    </div>
                  </div>

                  <h3
                    id="liability"
                    className="text-lg sm:text-xl flex items-center gap-3 mt-4"
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-800"
                    >
                      ⚠️
                    </span>
                    <span>{t("sections.liability.title")}</span>
                  </h3>
                  <p className="text-slate-700">
                    {t("sections.liability.text")}
                  </p>

                  <h3
                    id="disputes"
                    className="text-lg sm:text-xl flex items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800"
                    >
                      🤝
                    </span>
                    <span>{t("sections.disputes.title")}</span>
                  </h3>
                  <p className="text-slate-700">
                    {t("sections.disputes.text")}
                  </p>

                  <h3
                    id="contact"
                    className="text-lg sm:text-xl flex items-center gap-3"
                  >
                    <span
                      aria-hidden
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-800"
                    >
                      ✉️
                    </span>
                    <span>{t("sections.contact.title")}</span>
                  </h3>
                  <p className="text-slate-700">{t("sections.contact.text")}</p>
                </article>
              </CardContent>
            </Card>
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card className="border-transparent bg-white/80">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-3">
                    {t("links.summary")}
                  </h4>
                  <nav className="text-sm">
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="#summary"
                          className="block px-3 py-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          {t("links.summary")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#posting-listings"
                          className="block px-3 py-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          {t("links.postingListings")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#safety-tips"
                          className="block px-3 py-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          {t("links.safetyTips")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#liability"
                          className="block px-3 py-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          {t("links.liability")}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#contact"
                          className="block px-3 py-2 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          {t("links.contact")}
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
