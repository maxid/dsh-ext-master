const DEFAULT_PREVIEWS = Object.freeze({ markdown: ["mdc"] });

function normalizeKey(value) {
  const key = String(value).trim().toLowerCase();
  return /^[a-z0-9][a-z0-9._-]*$/u.test(key) ? key : "";
}

function normalizeExtensions(value) {
  const list = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  const result = [];
  for (const item of list) {
    const extension = String(item).trim().toLowerCase().replace(/^\./u, "");
    if (extension && /^[a-z0-9][a-z0-9._-]*$/u.test(extension) && !result.includes(extension)) {
      result.push(extension);
    }
  }
  return result;
}

function normalizePreviews(value, fallback) {
  if (value === undefined) return { ...fallback };
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...fallback };
  const result = {};
  for (const [preview, list] of Object.entries(value)) {
    const key = normalizeKey(preview);
    const extensions = normalizeExtensions(list);
    if (key && extensions.length) result[key] = extensions;
  }
  return result;
}

export const name = "dsh-ext-master";

export function apply(ctx, config = {}) {
  const previews = normalizePreviews(config && config.previews, DEFAULT_PREVIEWS);
  ctx.on("webserver/index-inject", (table) => {
    table.push({
      kind: "global",
      name: "__DSH_DOCUMENT_PREVIEW_EXTENSIONS__",
      value: previews,
    });
  });
}
