const DEFAULT_EXTENSIONS = ["mdc"];

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

export const name = "markdown-extensions";

export function apply(ctx, config = {}) {
  const extensions = normalizeExtensions(
    config && config.extensions !== undefined ? config.extensions : DEFAULT_EXTENSIONS,
  );
  ctx.on("webserver/index-inject", (table) => {
    table.push({
      kind: "global",
      name: "__DSH_MARKDOWN_EXTENSIONS__",
      value: extensions,
    });
  });
}
