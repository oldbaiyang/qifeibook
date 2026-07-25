const AUTHOR_PREFIX_PATTERN = /^[\[【(（〔][^\]】)）〕]{1,8}[\]】)）〕]\s*/;

export function getCanonicalAuthorName(name: string): string {
  const trimmed = name.trim();
  const withoutPrefix = trimmed.replace(AUTHOR_PREFIX_PATTERN, "").trim();
  return withoutPrefix || trimmed;
}

export function getAuthorLookupNames(name: string): string[] {
  const trimmed = name.trim();
  const canonicalName = getCanonicalAuthorName(trimmed);
  return [...new Set([trimmed, canonicalName].filter(Boolean))];
}
