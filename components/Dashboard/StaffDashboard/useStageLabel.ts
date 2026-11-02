"use client";

import { createTranslator, useLocale } from "next-intl";

// Match known names rather than IDs so custom stage names remain intact.
const stages = {
  registeredPaid: ["Registered / Paid", "登録済み / 支払済み"],
  vacancySearching: ["Vacancy Searching", "求人検索中"],
  interviewFixedPreparation: ["Interview Fixed / Preparation", "面接確定 / 準備中"],
  interviewFailed: ["Interview Failed", "面接不合格"],
  jobOfferReceived: ["Naitei / Job Offer Received", "内定 / オファー受領"],
  jobOfferAccepted: ["Job Offer Accepted", "内定承諾"],
  jobOfferNotAccepted: ["Job Offer Not Accepted", "内定未承諾"],
  visaDocumentsSubmitted: ["Visa Documents Submitted", "ビザ書類提出済み"],
  visaAppliedResultWaiting: ["Visa Applied / Result Waiting", "ビザ申請済み / 結果待ち"],
  visaApproved: ["Visa Approved", "ビザ承認"],
  visaRejected: ["Visa Rejected", "ビザ却下"],
  companyJoining: ["Waiting for Nyusha / Company Joining", "入社待ち"],
  employmentStartedCompanyJoined: ["Employment Started / Company Joined", "勤務開始 / 入社済み"],
  visaRenewal1Year: ["Visa Renewal - 1 Year", "ビザ更新 - 1年"],
  visaRenewal3Years: ["Visa Renewal - 3 Years", "ビザ更新 - 3年"],
  visaRenewal5Years: ["Visa Renewal - 5 Years", "ビザ更新 - 5年"],
  returnToNepal: ["Return to Nepal", "ネパールへ帰国"],
  new: ["New", "新規"],
  documentCollection: ["Document Collection", "書類収集中"],
  processing: ["Processing", "処理中"],
  coeApplied: ["COE Applied", "COE申請済み"],
  coeReceived: ["COE Received", "COE受領済み"],
  visaApplied: ["Visa Applied", "ビザ申請済み"],
  departed: ["Departed", "出国済み"],
  arrivedInJapan: ["Arrived in Japan", "日本到着"],
  registrationPending: ["Registration Pending", "登録待ち"],
  registeredVacancySearching: ["Registered / Vacancy Searching", "登録済み / 求人検索中"],
  legacyPayment: ["Legacy Payment", "過去の入金"],
} as const;

type StageKey = keyof typeof stages;
const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, " ").replace(/\s*\/\s*/g, "/");

const stageKeys = new Map<string, StageKey>();
for (const key of Object.keys(stages) as StageKey[]) {
  stageKeys.set(normalize(stages[key][0]), key);
  stageKeys.set(normalize(key), key);
}
stageKeys.set("job offer rejected", "jobOfferNotAccepted");

const catalogs = {
  en: Object.fromEntries(Object.entries(stages).map(([key, labels]) => [key, labels[0]])),
  ja: Object.fromEntries(Object.entries(stages).map(([key, labels]) => [key, labels[1]])),
};

export function useStageLabel() {
  const locale = useLocale();
  const t = createTranslator({ locale, messages: catalogs[locale === "ja" ? "ja" : "en"] });

  return (value?: string | null) => {
    if (!value) return "-";
    const key = stageKeys.get(normalize(value));
    return key ? t(key) : value;
  };
}
