export function json(data: unknown, init?: ResponseInit): Response {
  return Response.json(data, init);
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function clampLimit(value: number | null, fallback: number, max: number): number {
  if (!value || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(Math.max(value, 1), max);
}

export function parseInteger(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function decodePathSegment(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function notFound(message = "Not Found"): Response {
  return json({ ok: false, message }, { status: 404 });
}

/**
 * 判定一本图书是否为"薄内容"——描述太短且无下载链接。
 * 用于决定是否对该书详情页发出 noindex meta。
 */
export function isThinBook(book: {
  description?: string | null;
  downloadLinks: ReadonlyArray<unknown>;
}): boolean {
  const stripped = (book.description ?? "").trim();
  return stripped.length < 100 && book.downloadLinks.length === 0;
}

export function badRequest(message: string): Response {
  return json({ ok: false, message }, { status: 400 });
}

export function internalError(message = "Internal Server Error"): Response {
  return json({ ok: false, message }, { status: 500 });
}

export function withCacheHeaders(response: Response, cacheControl: string): Response {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", cacheControl);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
