import { generateBookJsonLd, generateBreadcrumbJsonLd, generateWebsiteJsonLd } from "@/lib/utils";

import type { AuthorSummary, BookSummary, CategorySummary, TagSummary } from "@/lib/data-access";

import type { BookDetailResponse } from "./types";
import { escapeHtml } from "./utils";

const SITE_NAME = "棋飞书库";
const SITE_URL = "https://qifeibook.com";
const DEFAULT_COVER = "/default-cover.svg";
const FEATURED_CATEGORY_LIMIT = 8;
const HOME_PAGE_BATCH_SIZE = 20;
export const SITEMAP_BOOK_PAGE_SIZE = 5000;
export const AUTHOR_INDEX_MIN_BOOKS = 2;
export const TAG_INDEX_MIN_BOOKS = 3;
const GENERIC_AUTHOR_NAMES = new Set(["多人", "佚名", "匿名", "不详", "未知", "无名氏", "作者不详"]);

export function isIndexableAuthor(author: AuthorSummary): boolean {
  const normalized = author.name.trim();
  if (author.bookCount < AUTHOR_INDEX_MIN_BOOKS || GENERIC_AUTHOR_NAMES.has(normalized)) {
    return false;
  }

  return !/^[\[【(（][^\]】)）]{1,8}[\]】)）]$/.test(normalized);
}

export function isIndexableTag(tag: TagSummary): boolean {
  return tag.bookCount >= TAG_INDEX_MIN_BOOKS && tag.name.trim().length >= 2;
}

function normalizeMetaDescription(value: string, maxLength = 160): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized;
}

function toSiteUrl(value: string, fallbackPath = DEFAULT_COVER): string {
  try {
    return new URL(value || fallbackPath, SITE_URL).toString();
  } catch {
    return new URL(fallbackPath, SITE_URL).toString();
  }
}

function renderJsonLd(data: unknown): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function renderLayout({
  title,
  description,
  canonical,
  body,
  extraHead = "",
  robots = "index,follow",
}: {
  title: string;
  description: string;
  canonical: string;
  body: string;
  extraHead?: string;
  robots?: string;
}): string {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3P6YQRFTHE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-3P6YQRFTHE');
    </script>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${escapeHtml(robots)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${extraHead}
    <style>
      :root {
        color-scheme: light;
        --bg: #f8fafc;
        --card: #ffffff;
        --border: #e2e8f0;
        --text: #0f172a;
        --muted: #64748b;
        --primary: #2563eb;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
      }
      a { color: inherit; text-decoration: none; }
      .page {
        max-width: 1120px;
        margin: 0 auto;
        padding: 24px 16px 64px;
      }
      .crumbs {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        color: var(--muted);
        font-size: 14px;
        margin-bottom: 16px;
      }
      .hero {
        background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 24px;
        margin-bottom: 24px;
      }
      .site-header {
        display: grid;
        gap: 10px;
        margin-bottom: 14px;
      }
      .site-hero-panel {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 340px;
        gap: 16px;
        align-items: center;
        padding: 16px 22px;
        border: 1px solid rgba(191, 219, 254, 0.8);
        border-radius: 20px;
        background:
          radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 34%),
          linear-gradient(135deg, #ffffff 0%, #f6faff 48%, #eef6ff 100%);
        box-shadow: 0 10px 28px rgba(148, 163, 184, 0.1);
      }
      .brand {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .brand strong {
        font-size: 34px;
        line-height: 1;
        letter-spacing: 0;
      }
      .brand span {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.45;
      }
      .search-form {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
      }
      .search-card {
        display: grid;
        gap: 0;
        align-content: start;
        padding: 12px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.88);
        border: 1px solid rgba(203, 213, 225, 0.95);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
      }
      .search-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 8px;
      }
      .search-form input {
        min-width: min(420px, 100%);
        max-width: 100%;
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 12px 14px;
        font: inherit;
      }
      .search-form button {
        border: 0;
        border-radius: 12px;
        background: var(--primary);
        color: #fff;
        padding: 12px 16px;
        font: inherit;
        cursor: pointer;
      }
      .search-card input {
        min-width: 0;
        width: 100%;
        padding: 10px 12px;
        border-radius: 12px;
        background: #fff;
      }
      .search-card button {
        min-width: 88px;
        min-height: 42px;
        border-radius: 12px;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        box-shadow: 0 8px 16px rgba(37, 99, 235, 0.18);
        font-weight: 700;
      }
      .category-panel {
        display: grid;
        gap: 12px;
        padding: 14px 16px;
        border-radius: 20px;
        border: 1px solid rgba(226, 232, 240, 0.95);
        background: rgba(255, 255, 255, 0.82);
      }
      .category-panel-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
      }
      .category-panel-head strong {
        font-size: 15px;
      }
      .category-panel-head span {
        color: var(--muted);
        font-size: 12px;
      }
      .chips {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 11px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: #fff;
        color: #334155;
        font-size: 13px;
        white-space: nowrap;
        transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
      }
      .chip:hover {
        transform: translateY(-1px);
        border-color: #bfdbfe;
        box-shadow: 0 8px 16px rgba(148, 163, 184, 0.12);
      }
      .chip strong {
        font-size: 12px;
        color: var(--muted);
      }
      .chip.is-active {
        background: #eff6ff;
        color: #1d4ed8;
        border-color: #bfdbfe;
      }
      .category-more details {
        margin-top: -2px;
      }
      .category-more summary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 12px;
        border-radius: 999px;
        background: #eff6ff;
        border: 1px solid #bfdbfe;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        list-style: none;
      }
      .category-more summary::-webkit-details-marker {
        display: none;
      }
      .category-more-panel {
        margin-top: 12px;
      }
      .catalog-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        margin: 6px 4px 20px;
      }
      .catalog-head h1 {
        margin: 0 0 4px;
        font-size: 34px;
        line-height: 1.08;
        letter-spacing: -0.03em;
      }
      .catalog-head p {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .catalog-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 999px;
        background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
        border: 1px solid #dbeafe;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
      }
      .title { margin: 0 0 8px; font-size: 30px; line-height: 1.2; }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        color: var(--muted);
        font-size: 14px;
      }
      .detail-hero {
        padding: 26px 28px;
      }
      .detail-kicker {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 10px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid rgba(191, 219, 254, 0.9);
        color: #1d4ed8;
        font-size: 12px;
        font-weight: 600;
      }
      .detail-title {
        margin: 0 0 10px;
        font-size: 40px;
        line-height: 1.08;
        letter-spacing: -0.04em;
      }
      .detail-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .detail-meta-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 34px;
        padding: 0 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.84);
        border: 1px solid rgba(219, 234, 254, 1);
        color: #334155;
        font-size: 13px;
      }
      .detail-meta-pill b {
        color: #0f172a;
      }
      .detail-layout {
        display: grid;
        grid-template-columns: 320px minmax(0, 1fr);
        gap: 24px;
        align-items: start;
      }
      .detail-sidebar {
        position: sticky;
        top: 18px;
        display: grid;
      }
      .detail-panel {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 22px;
        padding: 20px;
      }
      .detail-panel-soft {
        padding: 16px 18px;
        background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
      }
      .detail-panel-featured {
        padding: 22px 24px;
        border-color: #dbeafe;
        background:
          radial-gradient(circle at top right, rgba(191, 219, 254, 0.2), transparent 28%),
          linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
      }
      .detail-panel-download {
        padding: 22px 24px;
        border-color: #bfdbfe;
        background:
          radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 26%),
          linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
      }
      .detail-panel-title {
        margin: 0 0 14px;
        font-size: 24px;
        line-height: 1.15;
      }
      .detail-panel-subtitle {
        margin: 0 0 14px;
        color: var(--muted);
        font-size: 14px;
      }
      .detail-cover-card {
        padding: 18px;
      }
      .detail-cover-frame {
        position: relative;
        width: 100%;
        padding-top: 140%;
        overflow: hidden;
        border-radius: 18px;
        background: #e2e8f0;
      }
      .detail-cover-frame img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .detail-quick-meta {
        display: grid;
        gap: 10px;
        margin-top: 16px;
      }
      .detail-quick-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 10px;
        border-bottom: 1px dashed #e2e8f0;
        font-size: 13px;
      }
      .detail-quick-row:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }
      .detail-quick-label {
        color: var(--muted);
        white-space: nowrap;
      }
      .detail-quick-value {
        color: #0f172a;
        text-align: right;
      }
      .detail-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
      }
      .detail-tag {
        display: inline-flex;
        align-items: center;
        min-height: 30px;
        padding: 0 10px;
        border-radius: 999px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #475569;
        font-size: 12px;
        font-weight: 500;
      }
      .detail-main {
        display: grid;
        gap: 18px;
      }
      .detail-summary {
        display: grid;
        gap: 14px;
      }
      .detail-flow-copy {
        display: grid;
        gap: 10px;
      }
      .detail-author-copy {
        margin: 0;
        color: #475569;
        font-size: 14px;
        line-height: 1.8;
      }
      .detail-lead {
        margin: 0;
        color: #1e293b;
        font-size: 16px;
        line-height: 1.9;
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid #e0ecff;
      }
      .detail-description {
        margin: 0;
        color: #334155;
        font-size: 15px;
        line-height: 1.9;
        white-space: pre-wrap;
      }
      .detail-inline-description {
        white-space: normal;
      }
      .detail-inline-ellipsis {
        display: inline;
      }
      .detail-inline-extra {
        display: none;
      }
      .detail-flow-copy.is-open .detail-inline-ellipsis {
        display: none;
      }
      .detail-flow-copy.is-open .detail-inline-extra {
        display: inline;
      }
      .detail-more-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: fit-content;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        color: #2563eb;
        font-size: 14px;
        font-weight: 600;
        font: inherit;
      }
      .download-stack {
        display: grid;
        gap: 12px;
      }
      .download-card {
        display: grid;
        gap: 12px;
        padding: 16px;
        border-radius: 18px;
        border: 1px solid #dbeafe;
        background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
      }
      .download-card.is-featured {
        border-color: #93c5fd;
        box-shadow: 0 14px 28px rgba(37, 99, 235, 0.08);
      }
      .download-card-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: start;
      }
      .download-card-title {
        display: grid;
        gap: 6px;
      }
      .download-card-head strong {
        font-size: 18px;
        line-height: 1.2;
      }
      .download-code {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        padding: 10px 12px;
        border-radius: 14px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        color: #334155;
        font-size: 13px;
      }
      .download-code b {
        color: #0f172a;
        letter-spacing: 0.06em;
      }
      .download-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .download-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 16px;
        border-radius: 12px;
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: #fff;
        font-size: 14px;
        font-weight: 700;
      }
      .download-secondary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 0 14px;
        border-radius: 12px;
        background: #fff;
        border: 1px solid #dbeafe;
        color: #1d4ed8;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }
      .download-panel-grid {
        display: grid;
        gap: 14px;
      }
      .grid {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 24px;
      }
      .card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 20px;
      }
      .cover {
        width: 100%;
        border-radius: 16px;
        border: 1px solid var(--border);
        object-fit: cover;
      }
      .section-title {
        font-size: 18px;
        margin: 0 0 12px;
      }
      .text-block {
        white-space: pre-wrap;
        color: #334155;
      }
      .downloads {
        display: grid;
        gap: 12px;
      }
      .download-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 14px;
      }
      .download-item strong { font-size: 16px; }
      .download-item small { color: var(--muted); }
      .download-item a {
        align-self: flex-start;
        padding: 8px 12px;
        border-radius: 10px;
        background: var(--primary);
        color: #fff;
        font-size: 14px;
      }
      .book-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 24px;
      }
      .book-card {
        display: flex;
        flex-direction: column;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 14px;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      }
      .book-card:hover {
        transform: translateY(-2px);
        border-color: #d1d5db;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      }
      .book-card-cover {
        position: relative;
        width: 100%;
        padding-top: 140%;
        background: #f1f5f9;
        overflow: hidden;
        border-bottom: 1px solid #f1f5f9;
      }
      .book-card-cover img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.35s ease;
        background: #e2e8f0;
      }
      .book-card:hover .book-card-cover img {
        transform: scale(1.02);
      }
      .book-card-body {
        display: flex;
        flex-direction: column;
        padding: 10px 10px 8px;
        min-width: 0;
      }
      .book-card-title {
        margin: 0 0 1px;
        font-size: 14px;
        line-height: 1.32;
        font-weight: 600;
        color: #1e293b;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .book-card-author {
        margin: 0 0 5px;
        color: var(--muted);
        font-size: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .book-card-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding-top: 5px;
        border-top: 1px solid #f1f5f9;
      }
      .book-card-tag {
        display: inline-flex;
        align-items: center;
        min-width: 0;
        max-width: 100px;
        padding: 1px 7px;
        border-radius: 999px;
        background: #f1f5f9;
        color: #475569;
        font-size: 10px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .book-card-year {
        flex-shrink: 0;
        color: #94a3b8;
        font-size: 10px;
        font-weight: 500;
      }
      .empty {
        padding: 24px;
        text-align: center;
        color: var(--muted);
      }
      .load-more-wrap {
        display: flex;
        justify-content: center;
        padding: 24px 0 8px;
      }
      .pager {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 24px 0 8px;
      }
      .pager-pages {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .pager-link,
      .pager-gap {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 38px;
        min-height: 38px;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid var(--border);
        background: #fff;
        color: #334155;
        font-size: 13px;
        font-weight: 600;
      }
      .pager-link.is-current {
        border-color: #bfdbfe;
        background: #eff6ff;
        color: #1d4ed8;
      }
      .pager-link.is-disabled,
      .pager-gap {
        color: #94a3b8;
        background: #f8fafc;
      }
      .load-more-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
        padding: 0 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(226, 232, 240, 0.95);
        color: #64748b;
        font-size: 13px;
        cursor: default;
      }
      .load-more-status.is-clickable {
        cursor: pointer;
      }
      .load-more-dot {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: #60a5fa;
        animation: pulse-dot 1.2s ease-in-out infinite;
      }
      @keyframes pulse-dot {
        0%, 100% { opacity: 0.35; transform: scale(0.92); }
        50% { opacity: 1; transform: scale(1); }
      }
      @media (max-width: 1200px) {
        .book-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }
      }
      @media (max-width: 980px) {
        .site-hero-panel {
          grid-template-columns: 1fr;
        }
        .detail-layout {
          grid-template-columns: 1fr;
        }
        .detail-sidebar {
          position: static;
        }
        .book-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
      }
      @media (max-width: 860px) {
        .grid { grid-template-columns: 1fr; }
        .search-form input { min-width: 0; width: 100%; }
        .catalog-head {
          align-items: flex-start;
          flex-direction: column;
        }
        .brand strong {
          font-size: 34px;
        }
        .brand span {
          font-size: 15px;
        }
        .detail-title {
          font-size: 30px;
        }
      }
      @media (max-width: 640px) {
        .page {
          padding: 16px 12px 48px;
        }
        .site-hero-panel {
          padding: 18px 16px;
          border-radius: 20px;
        }
        .search-row {
          grid-template-columns: 1fr;
        }
        .search-card button {
          width: 100%;
        }
        .category-panel {
          padding: 12px;
        }
        .catalog-head h1 {
          font-size: 28px;
        }
        .detail-hero {
          padding: 20px 18px;
        }
        .detail-panel {
          padding: 16px;
        }
        .download-card-head {
          flex-direction: column;
        }
        .download-actions {
          flex-direction: column;
        }
        .download-primary,
        .download-secondary {
          width: 100%;
        }
        .book-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
      }
    </style>
  </head>
  <body>
    <main class="page">
      ${body}
    </main>
  </body>
</html>`;
}

function renderBreadcrumbs(items: Array<{ name: string; href?: string }>): string {
  return `<nav class="crumbs" aria-label="breadcrumb">${items
    .map((item, index) => {
      const label = escapeHtml(item.name);
      const rendered = item.href ? `<a href="${escapeHtml(item.href)}">${label}</a>` : `<span>${label}</span>`;
      return `${index > 0 ? "<span>/</span>" : ""}${rendered}`;
    })
    .join("")}</nav>`;
}

function generateItemListJsonLd(books: BookSummary[], pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: pageUrl,
    numberOfItems: books.length,
    itemListElement: books.map((book, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/book/${book.id}`,
      name: book.title,
    })),
  };
}

function getPagedPath(basePath: string, page: number): string {
  if (page <= 1) {
    return basePath;
  }

  return basePath === "/" ? `/page/${page}` : `${basePath}/page/${page}`;
}

function renderPagination({
  basePath,
  currentPage,
  totalPages,
}: {
  basePath: string;
  currentPage: number;
  totalPages: number;
}): string {
  if (totalPages <= 1) {
    return "";
  }

  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }
  if (currentPage < totalPages) {
    pages.add(currentPage + 1);
  }

  const orderedPages = [...pages].sort((a, b) => a - b);
  const pageLinks = orderedPages
    .map((page, index) => {
      const gap = index > 0 && page - orderedPages[index - 1] > 1 ? '<span class="pager-gap">...</span>' : "";
      const href = getPagedPath(basePath, page);
      const link =
        page === currentPage
          ? `<span class="pager-link is-current" aria-current="page">${page}</span>`
          : `<a class="pager-link" href="${escapeHtml(href)}">${page}</a>`;
      return `${gap}${link}`;
    })
    .join("");

  const prevLink =
    currentPage > 1
      ? `<a class="pager-link pager-prev" href="${escapeHtml(getPagedPath(basePath, currentPage - 1))}" rel="prev">上一页</a>`
      : '<span class="pager-link is-disabled">上一页</span>';
  const nextLink =
    currentPage < totalPages
      ? `<a class="pager-link pager-next" href="${escapeHtml(getPagedPath(basePath, currentPage + 1))}" rel="next">下一页</a>`
      : '<span class="pager-link is-disabled">下一页</span>';

  return `<nav class="pager" aria-label="分页导航">${prevLink}<div class="pager-pages">${pageLinks}</div>${nextLink}</nav>`;
}

function renderPaginationHead(basePath: string, currentPage: number, totalPages: number): string {
  const links: string[] = [];
  if (currentPage > 1) {
    links.push(`<link rel="prev" href="${SITE_URL}${escapeHtml(getPagedPath(basePath, currentPage - 1))}" />`);
  }
  if (currentPage < totalPages) {
    links.push(`<link rel="next" href="${SITE_URL}${escapeHtml(getPagedPath(basePath, currentPage + 1))}" />`);
  }
  return links.join("\n");
}

function renderAuthorHref(author: string): string {
  return `/author/${encodeURIComponent(author)}`;
}

function renderTagHref(tag: string): string {
  return `/tag/${encodeURIComponent(tag)}`;
}

function renderBookListItems(books: BookSummary[]): string {
  return books
    .map(
      (book) => `<article>
  <a class="book-card" href="/book/${book.id}" aria-label="查看《${escapeHtml(book.title)}》详情">
    <div class="book-card-cover">
      <img
        src="${escapeHtml(book.cover || DEFAULT_COVER)}"
        alt="${escapeHtml(book.title)}封面"
        loading="lazy"
        decoding="async"
        referrerpolicy="no-referrer"
        onerror="this.onerror=null;this.src='${DEFAULT_COVER}'"
      />
    </div>
    <div class="book-card-body">
      <h3 class="book-card-title">${escapeHtml(book.title)}</h3>
      <p class="book-card-author">${escapeHtml(book.author)}</p>
      <div class="book-card-meta">
        <span class="book-card-tag">${escapeHtml(book.category || "未分类")}</span>
        ${book.year ? `<span class="book-card-year">${escapeHtml(book.year)}</span>` : '<span class="book-card-year">-</span>'}
      </div>
    </div>
  </a>
</article>`,
    )
    .join("");
}

function splitDescription(description: string): { preview: string; remaining: string } {
  const normalized = description.replace(/\s+/g, " ").trim();
  if (normalized.length <= 150) {
    return {
      preview: normalized,
      remaining: "",
    };
  }

  return {
    preview: normalized.slice(0, 150),
    remaining: normalized.slice(150).trim(),
  };
}

function renderExpandableCopy(
  text: string,
  {
    paragraphClass,
    expandLabel = "展开完整简介",
    collapseLabel = "收起简介",
  }: {
    paragraphClass: string;
    expandLabel?: string;
    collapseLabel?: string;
  },
): string {
  const { preview, remaining } = splitDescription(text);
  const paragraphClasses = `${paragraphClass} detail-inline-description`;

  return `<div class="detail-flow-copy${remaining ? "" : " is-open"}">
    <p class="${escapeHtml(paragraphClasses)}">${escapeHtml(preview)}${remaining ? '<span class="detail-inline-ellipsis">…</span><span class="detail-inline-extra">' + escapeHtml(remaining) + "</span>" : ""}</p>
    ${
      remaining
        ? `<button type="button" class="detail-more-button" onclick='const root=this.closest(".detail-flow-copy");const open=root.classList.toggle("is-open");this.textContent=open?${JSON.stringify(collapseLabel)}:${JSON.stringify(expandLabel)};return false;'>${escapeHtml(expandLabel)}</button>`
        : ""
    }
  </div>`;
}

function renderDownloadCards(book: BookDetailResponse): string {
  if (book.downloadLinks.length === 0) {
    return '<div class="empty">当前书籍暂时没有可用下载链接。</div>';
  }

  return book.downloadLinks
    .map((link, index) => {
      const isFeatured = index === 0;
      const copyCodeAction = link.code
        ? `onclick='navigator.clipboard&&navigator.clipboard.writeText(${JSON.stringify(link.code)});this.textContent="已复制";setTimeout(()=>this.textContent="复制提取码",1200);return false;'`
        : "";

      return `<div class="download-card${isFeatured ? " is-featured" : ""}">
  <div class="download-card-head">
    <div class="download-card-title">
      <strong>${escapeHtml(link.name)}</strong>
    </div>
  </div>
  ${
    link.code
      ? `<div class="download-code">
    <span>提取码</span>
    <b>${escapeHtml(link.code)}</b>
  </div>`
      : ""
  }
  <div class="download-actions">
    <a class="download-primary" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer nofollow">前往下载</a>
    ${link.code ? `<button type="button" class="download-secondary" ${copyCodeAction}>复制提取码</button>` : ""}
  </div>
</div>`;
    })
    .join("");
}

function getDownloadProviderLabel(link: { name: string; provider?: string }): string {
  if (link.provider === "baidu" || link.name.includes("百度")) return "百度网盘";
  if (link.provider === "quark" || link.name.includes("夸克")) return "夸克网盘";
  if (link.provider === "aliyun" || link.name.includes("阿里")) return "阿里云盘";
  if (link.provider === "xunlei" || link.name.includes("迅雷")) return "迅雷网盘";
  return link.name.trim() || "网盘";
}

function getDownloadMetaPhrase(book: BookDetailResponse): string {
  const providers = Array.from(
    new Set(
      book.downloadLinks
        .filter((link) => link.url && link.url !== "0")
        .map(getDownloadProviderLabel),
    ),
  );

  return providers.length > 0 ? `${providers.join("、")}免费下载` : "电子书详情与内容简介";
}

function renderCategoryPanel(categories: CategorySummary[]): string {
  const featuredCategories = categories.slice(0, FEATURED_CATEGORY_LIMIT);
  const remainingCategories = categories.slice(FEATURED_CATEGORY_LIMIT);

  return `
    <section class="category-panel">
      <div class="category-panel-head">
        <strong>热门分类</strong>
        <span>先展示收录量更高的分类</span>
      </div>
      <div class="chips">
        <a class="chip is-active" href="/">全部</a>
        ${featuredCategories
          .map(
            (category) => `<a class="chip" href="/category/${escapeHtml(category.slug)}">
  <span>${escapeHtml(category.name)}</span>
  <strong>${category.bookCount}</strong>
</a>`,
          )
          .join("")}
      </div>
      ${
        remainingCategories.length
          ? `<div class="category-more">
        <details>
          <summary>展开全部分类 <span>${categories.length}</span></summary>
          <div class="chips category-more-panel">
            ${remainingCategories
              .map(
                (category) => `<a class="chip" href="/category/${escapeHtml(category.slug)}">
  <span>${escapeHtml(category.name)}</span>
  <strong>${category.bookCount}</strong>
</a>`,
              )
              .join("")}
          </div>
        </details>
      </div>`
          : ""
      }
    </section>
  `;
}

function renderSiteHeader(categories: CategorySummary[], searchQuery = ""): string {
  return `
    <header class="site-header">
      <section class="site-hero-panel">
        <div>
          <a class="brand" href="/">
            <strong>${SITE_NAME}</strong>
            <span>更快找到值得读的书。支持按书名、作者与分类浏览，首页保持轻量、直达、好读。</span>
          </a>
        </div>
        <form class="search-form search-card" action="/search" method="get">
          <div class="search-row">
            <input
              id="site-search-input"
              type="search"
              name="q"
              aria-label="搜索书名、作者、关键词"
              value="${escapeHtml(searchQuery)}"
              placeholder="搜索书名、作者、关键词"
            />
            <button type="submit">搜索</button>
          </div>
        </form>
      </section>
      ${renderCategoryPanel(categories)}
    </header>
  `;
}

export function renderHomePage(payload: {
  categories: CategorySummary[];
  books: BookSummary[];
  totalBooks: number;
  nextCursor: number | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}): string {
  const canonical = `${SITE_URL}${getPagedPath("/", payload.currentPage)}`;
  const title =
    payload.currentPage > 1
      ? `全部图书第${payload.currentPage}页_经典电子书免费下载_棋飞书库`
      : "棋飞书库 - 经典电子书免费下载 | EPUB/MOBI/PDF格式";
  const description = normalizeMetaDescription(
    payload.currentPage > 1
      ? `棋飞书库全部图书第 ${payload.currentPage} 页，继续浏览精选电子书目录，支持 EPUB、MOBI、PDF 等格式导航。`
      : `棋飞书库提供 ${payload.totalBooks} 本精选电子书目录，支持 EPUB、MOBI、PDF 等格式导航浏览。`,
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([{ name: "首页", url: canonical }]);
  const websiteJsonLd = generateWebsiteJsonLd();
  const itemListJsonLd = generateItemListJsonLd(payload.books, canonical);
  const initialStatus = payload.hasMore ? "下拉到底部自动加载更多图书" : "已展示全部图书";
  const loadMoreScript = `
    <script>
      (() => {
        const grid = document.getElementById("home-book-grid");
        const sentinel = document.getElementById("home-load-sentinel");
        const status = document.getElementById("home-load-status");

        if (!grid || !sentinel || !status) {
          return;
        }

        let nextCursor = grid.dataset.nextCursor ? Number(grid.dataset.nextCursor) : null;
        let hasMore = grid.dataset.hasMore === "true";
        let isLoading = false;

        const escapeHtml = (value) =>
          String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");

        const setStatus = (text, mode) => {
          status.classList.remove("is-clickable");
          if (mode === "loading") {
            status.innerHTML = '<span class="load-more-dot"></span><span>' + escapeHtml(text) + "</span>";
            return;
          }

          status.textContent = text;
          if (mode === "error") {
            status.classList.add("is-clickable");
          }
        };

        const renderBookCard = (book) => {
          const year = book.year ? '<span class="book-card-year">' + escapeHtml(book.year) + "</span>" : '<span class="book-card-year">-</span>';
          return '<article><a class="book-card" href="/book/' + book.id + '" aria-label="查看《' + escapeHtml(book.title) + '》详情"><div class="book-card-cover"><img src="' + escapeHtml(book.cover || "${DEFAULT_COVER}") + '" alt="' + escapeHtml(book.title) + '封面" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\\'${DEFAULT_COVER}\\'" /></div><div class="book-card-body"><h3 class="book-card-title">' + escapeHtml(book.title) + '</h3><p class="book-card-author">' + escapeHtml(book.author) + '</p><div class="book-card-meta"><span class="book-card-tag">' + escapeHtml(book.category || "未分类") + '</span>' + year + "</div></div></a></article>";
        };

        const observer = new IntersectionObserver((entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            void loadMore();
          }
        }, { rootMargin: "360px 0px" });

        const stopLoading = (finalText) => {
          hasMore = false;
          grid.dataset.hasMore = "false";
          observer.disconnect();
          setStatus(finalText, "done");
        };

        const loadMore = async () => {
          if (!hasMore || isLoading || !nextCursor) {
            return;
          }

          isLoading = true;
          setStatus("正在加载下一批图书…", "loading");

          try {
            const response = await fetch('/api/books?cursor=' + encodeURIComponent(String(nextCursor)) + '&limit=${HOME_PAGE_BATCH_SIZE}', {
              headers: { Accept: "application/json" },
              cache: "no-store"
            });

            if (!response.ok) {
              throw new Error("HTTP " + response.status);
            }

            const payload = await response.json();
            if (Array.isArray(payload.books) && payload.books.length > 0) {
              grid.insertAdjacentHTML("beforeend", payload.books.map(renderBookCard).join(""));
            }

            nextCursor = payload.nextCursor ?? null;
            hasMore = Boolean(payload.hasMore && nextCursor);
            grid.dataset.nextCursor = nextCursor ? String(nextCursor) : "";
            grid.dataset.hasMore = hasMore ? "true" : "false";

            if (!hasMore) {
              stopLoading("已展示全部图书");
            } else {
              setStatus("继续下拉，自动加载更多", "idle");
            }
          } catch (error) {
            console.error("Failed to load more books:", error);
            setStatus("加载失败，点这里重试", "error");
          } finally {
            isLoading = false;
          }
        };

        status.addEventListener("click", () => {
          if (status.classList.contains("is-clickable")) {
            void loadMore();
          }
        });

        if (hasMore && nextCursor) {
          observer.observe(sentinel);
        } else {
          stopLoading("已展示全部图书");
        }
      })();
    </script>
  `;

  const body = `
    ${renderSiteHeader(payload.categories)}
    <section class="catalog-head">
      <div>
        <h1>全部图书</h1>
        <p>${payload.totalBooks} 本精选电子书，持续更新中。当前第 ${payload.currentPage} / ${payload.totalPages} 页，每页展示 ${HOME_PAGE_BATCH_SIZE} 本。</p>
      </div>
      <div class="catalog-badge">持续更新中</div>
    </section>
    <section
      id="home-book-grid"
      class="book-grid"
      data-next-cursor="${payload.nextCursor ?? ""}"
      data-has-more="${payload.hasMore ? "true" : "false"}"
    >
      ${payload.books.length ? renderBookListItems(payload.books) : '<div class="empty">当前暂无图书</div>'}
    </section>
    <div class="load-more-wrap">
      <div id="home-load-status" class="load-more-status">${initialStatus}</div>
    </div>
    ${renderPagination({ basePath: "/", currentPage: payload.currentPage, totalPages: payload.totalPages })}
    <div id="home-load-sentinel" aria-hidden="true"></div>
    ${loadMoreScript}
  `;

  return renderLayout({
    title,
    description,
    canonical,
    body,
    extraHead: [
      renderPaginationHead("/", payload.currentPage, payload.totalPages),
      renderJsonLd(websiteJsonLd),
      renderJsonLd(breadcrumbJsonLd),
      renderJsonLd(itemListJsonLd),
    ].join("\n"),
  });
}

export function renderSearchPage(payload: {
  categories: CategorySummary[];
  query: string;
  books: BookSummary[];
  total: number;
}): string {
  const normalizedQuery = payload.query.trim();
  const canonical = `${SITE_URL}/search`;
  const title = normalizedQuery
    ? `搜索“${normalizedQuery}”_棋飞书库`
    : "搜索书籍_棋飞书库";
  const description = normalizedQuery
    ? `搜索“${normalizedQuery}”的结果，共找到 ${payload.total} 本相关图书。`
    : "在棋飞书库中按书名、作者或关键词搜索电子书。";
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "首页", url: `${SITE_URL}/` },
    { name: "搜索", url: `${SITE_URL}/search` },
  ]);

  const body = `
    ${renderSiteHeader(payload.categories, normalizedQuery)}
    ${renderBreadcrumbs([
      { name: "首页", href: "/" },
      { name: "搜索" },
    ])}
    <section class="hero">
      <h1 class="title">${normalizedQuery ? `搜索结果：${escapeHtml(normalizedQuery)}` : "搜索书籍"}</h1>
      <div class="meta">
        ${
          normalizedQuery
            ? `<span>共找到 ${payload.total} 本相关图书</span><span>当前展示前 20 本结果</span>`
            : "<span>输入书名、作者或关键词开始搜索</span>"
        }
      </div>
    </section>
    <section class="book-grid">
      ${
        normalizedQuery
          ? payload.books.length
            ? renderBookListItems(payload.books)
            : '<div class="empty">没有找到相关图书，请尝试更换关键词。</div>'
          : '<div class="empty">请输入搜索关键词。</div>'
      }
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonical,
    body,
    robots: "noindex,follow",
    extraHead: renderJsonLd(breadcrumbJsonLd),
  });
}

export function renderBookPage(book: BookDetailResponse): string {
  const canonical = `${SITE_URL}/book/${book.id}`;
  const title = `《${book.title}》${book.author}_EPUB/MOBI/PDF免费下载_棋飞书库`;
  const descriptionIntro = book.description
    ? book.description
    : `${book.title}电子书详情页，包含作者、分类、格式与下载导航信息。`;
  const description = normalizeMetaDescription(
    `《${book.title}》${book.author}著。${descriptionIntro.slice(0, 120)} 支持EPUB、MOBI、PDF格式，${getDownloadMetaPhrase(book)}。`,
  );
  const bookJsonLd = generateBookJsonLd(book, String(book.id));
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "首页", url: `${SITE_URL}/` },
    { name: book.category, url: `${SITE_URL}/category/${encodeURIComponent(book.categorySlug)}` },
    { name: book.title, url: canonical },
  ]);
  const extraHead = `
    ${renderJsonLd(bookJsonLd)}
    ${renderJsonLd(breadcrumbJsonLd)}
    <meta property="og:image" content="${escapeHtml(toSiteUrl(book.cover))}" />
  `;

  const body = `
    ${renderBreadcrumbs([
      { name: "首页", href: "/" },
      { name: book.category, href: `/category/${book.categorySlug}` },
      { name: book.title },
    ])}
    <section class="hero detail-hero">
      <div class="detail-kicker">${escapeHtml(book.category)} · 电子书详情</div>
      <h1 class="detail-title">${escapeHtml(book.title)}</h1>
      <div class="detail-meta">
        <span class="detail-meta-pill"><b>作者</b><a href="${escapeHtml(renderAuthorHref(book.author))}">${escapeHtml(book.author)}</a></span>
        <span class="detail-meta-pill"><b>分类</b><a href="/category/${escapeHtml(book.categorySlug)}">${escapeHtml(book.category)}</a></span>
        ${book.format ? `<span class="detail-meta-pill"><b>格式</b>${escapeHtml(book.format)}</span>` : ""}
        ${book.size ? `<span class="detail-meta-pill"><b>大小</b>${escapeHtml(book.size)}</span>` : ""}
        ${book.publishYear ? `<span class="detail-meta-pill"><b>出版年</b>${escapeHtml(book.publishYear)}</span>` : ""}
      </div>
    </section>
    <section class="detail-layout">
      <aside class="detail-sidebar">
        <section class="detail-panel detail-cover-card">
          <div class="detail-cover-frame">
            <img
              src="${escapeHtml(book.cover || DEFAULT_COVER)}"
              alt="${escapeHtml(book.title)}封面"
              decoding="async"
              referrerpolicy="no-referrer"
              onerror="this.onerror=null;this.src='${DEFAULT_COVER}'"
            />
          </div>
          <div class="detail-quick-meta">
            <div class="detail-quick-row">
              <span class="detail-quick-label">作者</span>
              <span class="detail-quick-value"><a href="${escapeHtml(renderAuthorHref(book.author))}">${escapeHtml(book.author)}</a></span>
            </div>
            <div class="detail-quick-row">
              <span class="detail-quick-label">分类</span>
              <span class="detail-quick-value"><a href="/category/${escapeHtml(book.categorySlug)}">${escapeHtml(book.category)}</a></span>
            </div>
            ${book.format ? `<div class="detail-quick-row"><span class="detail-quick-label">格式</span><span class="detail-quick-value">${escapeHtml(book.format)}</span></div>` : ""}
            ${book.size ? `<div class="detail-quick-row"><span class="detail-quick-label">大小</span><span class="detail-quick-value">${escapeHtml(book.size)}</span></div>` : ""}
            ${book.publishYear ? `<div class="detail-quick-row"><span class="detail-quick-label">出版年</span><span class="detail-quick-value">${escapeHtml(book.publishYear)}</span></div>` : ""}
            <div class="detail-quick-row">
              <span class="detail-quick-label">下载源</span>
              <span class="detail-quick-value">${book.downloadLinks.length} 个</span>
            </div>
          </div>
          ${
            book.keywords.length > 0
              ? `<div class="detail-tags">${book.keywords
                  .slice(0, 8)
                  .map((keyword) => `<a class="detail-tag" href="${escapeHtml(renderTagHref(keyword))}">${escapeHtml(keyword)}</a>`)
                  .join("")}</div>`
              : ""
          }
        </section>
      </aside>
      <div class="detail-main">
        ${
          book.authorDetail
            ? `<section class="detail-panel detail-panel-soft">
          <h2 class="section-title">作者简介</h2>
          ${renderExpandableCopy(book.authorDetail, {
            paragraphClass: "detail-author-copy",
            expandLabel: "展开完整作者简介",
            collapseLabel: "收起作者简介",
          })}
        </section>`
            : ""
        }
        ${
          book.description
            ? `<section class="detail-panel detail-panel-featured">
          <h2 class="section-title">内容简介</h2>
          <div class="detail-summary">
            ${renderExpandableCopy(book.description, { paragraphClass: "detail-lead" })}
          </div>
        </section>`
            : ""
        }
        <section class="detail-panel detail-panel-download">
          <h2 class="section-title">下载地址</h2>
          <div class="download-panel-grid">
            ${renderDownloadCards(book)}
          </div>
        </section>
      </div>
    </section>
    <section style="margin-top: 32px;">
      <h2 class="section-title">你可能还喜欢</h2>
      <div class="book-grid">
        ${book.relatedBooks.length ? renderBookListItems(book.relatedBooks) : '<div class="empty">暂无相关推荐</div>'}
      </div>
    </section>
  `;

  return renderLayout({
    title,
    description,
    canonical,
    body,
    extraHead,
    robots: !book.description && book.downloadLinks.length === 0 ? "noindex,follow" : "index,follow",
  });
}

export function renderCategoryPage(
  category: CategorySummary,
  books: BookSummary[],
  pagination: { currentPage: number; totalPages: number },
): string {
  const basePath = `/category/${encodeURIComponent(category.slug)}`;
  const canonical = `${SITE_URL}${getPagedPath(basePath, pagination.currentPage)}`;
  const title =
    pagination.currentPage > 1
      ? `${category.name}电子书推荐第${pagination.currentPage}页_棋飞书库`
      : `${category.name}电子书推荐_${category.bookCount}本精选好书免费下载_棋飞书库`;
  const sampleBooks = books.slice(0, 5).map((book) => `《${book.title}》`).join("、");
  const description = normalizeMetaDescription(
    `${category.name}电子书推荐：共${category.bookCount}本精选好书免费下载，当前第 ${pagination.currentPage} / ${pagination.totalPages} 页${sampleBooks ? `，包括${sampleBooks}等` : ""}。支持EPUB、MOBI、PDF格式，夸克网盘、百度网盘高速下载。`,
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "首页", url: `${SITE_URL}/` },
    { name: category.name, url: canonical },
  ]);
  const itemListJsonLd = generateItemListJsonLd(books, canonical);

  const body = `
    ${renderBreadcrumbs([
      { name: "首页", href: "/" },
      { name: category.name },
    ])}
    <section class="hero">
      <h1 class="title">${escapeHtml(category.name)}</h1>
      <div class="meta">
        <span>共 ${category.bookCount} 本精选图书</span>
        <span>第 ${pagination.currentPage} / ${pagination.totalPages} 页</span>
      </div>
    </section>
    <section class="book-grid">
      ${books.length ? renderBookListItems(books) : '<div class="empty">当前分类暂无图书</div>'}
    </section>
    ${renderPagination({ basePath, currentPage: pagination.currentPage, totalPages: pagination.totalPages })}
  `;

  return renderLayout({
    title,
    description,
    canonical,
    body,
    extraHead: [renderPaginationHead(basePath, pagination.currentPage, pagination.totalPages), renderJsonLd(breadcrumbJsonLd), renderJsonLd(itemListJsonLd)].join("\n"),
  });
}

export function renderAuthorPage(
  author: AuthorSummary,
  books: BookSummary[],
  pagination: { currentPage: number; totalPages: number },
): string {
  const basePath = renderAuthorHref(author.name);
  const canonical = `${SITE_URL}${getPagedPath(basePath, pagination.currentPage)}`;
  const title =
    pagination.currentPage > 1
      ? `${author.name}作品第${pagination.currentPage}页_电子书免费下载_棋飞书库`
      : `${author.name}作品全集_${author.bookCount}本电子书免费下载_棋飞书库`;
  const sampleBooks = books.slice(0, 5).map((book) => `《${book.title}》`).join("、");
  const description = normalizeMetaDescription(
    `${author.name}作品电子书合集：共${author.bookCount}本，当前第 ${pagination.currentPage} / ${pagination.totalPages} 页${sampleBooks ? `，包括${sampleBooks}等` : ""}。支持EPUB、MOBI、PDF格式下载导航。`,
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "首页", url: `${SITE_URL}/` },
    { name: author.name, url: canonical },
  ]);
  const itemListJsonLd = generateItemListJsonLd(books, canonical);

  const body = `
    ${renderBreadcrumbs([
      { name: "首页", href: "/" },
      { name: author.name },
    ])}
    <section class="hero">
      <h1 class="title">${escapeHtml(author.name)}作品</h1>
      <div class="meta">
        <span>共 ${author.bookCount} 本图书</span>
        <span>第 ${pagination.currentPage} / ${pagination.totalPages} 页</span>
      </div>
    </section>
    <section class="book-grid">
      ${books.length ? renderBookListItems(books) : '<div class="empty">当前作者暂无图书</div>'}
    </section>
    ${renderPagination({ basePath, currentPage: pagination.currentPage, totalPages: pagination.totalPages })}
  `;

  return renderLayout({
    title,
    description,
    canonical,
    body,
    extraHead: [renderPaginationHead(basePath, pagination.currentPage, pagination.totalPages), renderJsonLd(breadcrumbJsonLd), renderJsonLd(itemListJsonLd)].join("\n"),
    robots: isIndexableAuthor(author) ? "index,follow" : "noindex,follow",
  });
}

export function renderTagPage(
  tag: TagSummary,
  books: BookSummary[],
  pagination: { currentPage: number; totalPages: number },
): string {
  const basePath = renderTagHref(tag.name);
  const canonical = `${SITE_URL}${getPagedPath(basePath, pagination.currentPage)}`;
  const title =
    pagination.currentPage > 1
      ? `${tag.name}电子书第${pagination.currentPage}页_棋飞书库`
      : `${tag.name}电子书推荐_${tag.bookCount}本相关好书免费下载_棋飞书库`;
  const sampleBooks = books.slice(0, 5).map((book) => `《${book.title}》`).join("、");
  const description = normalizeMetaDescription(
    `${tag.name}相关电子书推荐：共${tag.bookCount}本，当前第 ${pagination.currentPage} / ${pagination.totalPages} 页${sampleBooks ? `，包括${sampleBooks}等` : ""}。支持EPUB、MOBI、PDF格式下载导航。`,
  );
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "首页", url: `${SITE_URL}/` },
    { name: tag.name, url: canonical },
  ]);
  const itemListJsonLd = generateItemListJsonLd(books, canonical);

  const body = `
    ${renderBreadcrumbs([
      { name: "首页", href: "/" },
      { name: tag.name },
    ])}
    <section class="hero">
      <h1 class="title">${escapeHtml(tag.name)}电子书</h1>
      <div class="meta">
        <span>共 ${tag.bookCount} 本相关图书</span>
        <span>第 ${pagination.currentPage} / ${pagination.totalPages} 页</span>
      </div>
    </section>
    <section class="book-grid">
      ${books.length ? renderBookListItems(books) : '<div class="empty">当前标签暂无图书</div>'}
    </section>
    ${renderPagination({ basePath, currentPage: pagination.currentPage, totalPages: pagination.totalPages })}
  `;

  return renderLayout({
    title,
    description,
    canonical,
    body,
    extraHead: [renderPaginationHead(basePath, pagination.currentPage, pagination.totalPages), renderJsonLd(breadcrumbJsonLd), renderJsonLd(itemListJsonLd)].join("\n"),
    robots: isIndexableTag(tag) ? "index,follow" : "noindex,follow",
  });
}

export function renderNotFoundPage(title: string, message: string): string {
  return renderLayout({
    title: `${title}_${SITE_NAME}`,
    description: message,
    canonical: SITE_URL,
    robots: "noindex,follow",
    body: `
      <section class="hero">
        <h1 class="title">${escapeHtml(title)}</h1>
        <p class="meta">${escapeHtml(message)}</p>
        <p style="margin-top:16px;"><a href="/" style="color: var(--primary);">返回首页</a></p>
      </section>
    `,
  });
}

export function renderRobotsTxt(): string {
  return `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function renderUrlEntry(url: string, lastmod?: string): string {
  const normalizedLastmod = lastmod?.trim();
  return `<url><loc>${escapeHtml(url)}</loc>${normalizedLastmod ? `<lastmod>${escapeHtml(normalizedLastmod)}</lastmod>` : ""}</url>`;
}

export function renderSitemapIndexXml(payload: { bookCount: number }): string {
  const bookSitemapCount = Math.max(1, Math.ceil(payload.bookCount / SITEMAP_BOOK_PAGE_SIZE));
  const sitemapUrls = [
    `${SITE_URL}/sitemaps/static.xml`,
    `${SITE_URL}/sitemaps/categories.xml`,
    `${SITE_URL}/sitemaps/authors.xml`,
    `${SITE_URL}/sitemaps/tags.xml`,
    ...Array.from({ length: bookSitemapCount }, (_, index) => `${SITE_URL}/sitemaps/books-${index + 1}.xml`),
  ];

  const body = sitemapUrls.map((url) => `<sitemap><loc>${escapeHtml(url)}</loc></sitemap>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export function renderFlatSitemapXml(payload: {
  categories: CategorySummary[];
  authors: AuthorSummary[];
  tags: TagSummary[];
  books: Array<{ id: number; lastmod?: string }>;
}): string {
  const staticUrls = [`${SITE_URL}/`];
  const body = [
    ...staticUrls.map((url) => renderUrlEntry(url)),
    ...payload.categories.map((category) => renderUrlEntry(`${SITE_URL}/category/${encodeURIComponent(category.slug)}`)),
    ...payload.authors.map((author) => renderUrlEntry(`${SITE_URL}${renderAuthorHref(author.name)}`)),
    ...payload.tags.map((tag) => renderUrlEntry(`${SITE_URL}${renderTagHref(tag.name)}`)),
    ...payload.books.map((book) => renderUrlEntry(`${SITE_URL}/book/${book.id}`, book.lastmod)),
  ].join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function renderStaticSitemapXml(): string {
  const urls = [`${SITE_URL}/`];
  const body = urls.map((url) => renderUrlEntry(url)).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function renderCategorySitemapXml(categories: CategorySummary[]): string {
  const body = categories
    .map((category) => renderUrlEntry(`${SITE_URL}/category/${encodeURIComponent(category.slug)}`))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function renderAuthorSitemapXml(authors: AuthorSummary[]): string {
  const body = authors
    .map((author) => renderUrlEntry(`${SITE_URL}${renderAuthorHref(author.name)}`))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function renderTagSitemapXml(tags: TagSummary[]): string {
  const body = tags
    .map((tag) => renderUrlEntry(`${SITE_URL}${renderTagHref(tag.name)}`))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function renderBookSitemapXml(entries: Array<{ id: number; lastmod?: string }>): string {
  const body = entries
    .map((entry) => renderUrlEntry(`${SITE_URL}/book/${entry.id}`, entry.lastmod))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}
