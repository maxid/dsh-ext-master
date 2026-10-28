window.__ModuleLoader__.load({
  id: "dsh-ext-master",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const DEFAULT_PREVIEWS = { markdown: ["mdc"] };

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

    function findPreviewDefinition(definitions, preview) {
      const exact = `@deepseek-ai/dsh-client-ui-sidebar-documentpreview/${preview}`;
      return (
        definitions.find((definition) => definition.id === exact) ||
        definitions.find(
          (definition) => typeof definition.id === "string" && definition.id.endsWith(`/${preview}`),
        )
      );
    }

    function patchPreviewExtensions(ctx, previews) {
      const patch = () => {
        let definitions;
        try {
          definitions = ctx.documentPreviews.getSnapshot();
        } catch (error) {
          return;
        }
        for (const [preview, extensions] of Object.entries(previews)) {
          const definition = findPreviewDefinition(definitions, preview);
          if (!definition || !Array.isArray(definition.extensions)) continue;
          for (const extension of extensions) {
            if (!definition.extensions.includes(extension)) {
              definition.extensions.push(extension);
            }
          }
        }
      };
      patch();
      ctx.effect(() => ctx.documentPreviews.subscribe(patch));
    }

    const inject = ["documentPreviews"];

    function apply(ctx) {
      const configured = globalThis.__DSH_DOCUMENT_PREVIEW_EXTENSIONS__;
      patchPreviewExtensions(
        ctx,
        normalizePreviews(configured, DEFAULT_PREVIEWS),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
