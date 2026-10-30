"use client";

import Link from "next/link";
import { createTranslator, useLocale } from "next-intl";

const messages = {
  en: { navigation: "Breadcrumb" },
  ja: { navigation: "パンくずリスト" },
};

type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = useLocale();
  const t = createTranslator({
    locale,
    messages: messages[locale === "ja" ? "ja" : "en"],
  });
  return (
    <nav aria-label={t("navigation")} className="text-sm text-gray-500 mb-4">
      <ol className="flex items-center flex-wrap gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const contentClass = item.current
            ? "text-gray-800 font-medium"
            : "hover:text-blue-600 transition-colors";

          const handleClick = () => {
            if (item.onClick) {
              item.onClick();
            }
          };

          const content = item.current ? (
            <span aria-current="page" className={contentClass}>
              {item.label}
            </span>
          ) : item.href ? (
            <Link
              href={item.href}
              className={contentClass}
            >
              {item.label}
            </Link>
          ) : item.onClick ? (
            <button type="button" onClick={handleClick} className={contentClass}>
              {item.label}
            </button>
          ) : (
            <span aria-current={item.current ? "page" : undefined} className={contentClass}>
              {item.label}
            </span>
          );

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {content}
              {!isLast && <span className="text-gray-400">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
