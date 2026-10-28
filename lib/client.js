window.__ModuleLoader__.load({
  id: "dsh-markdown-extensions",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

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

    function patchMarkdownExtensions(ctx, extensions) {
      if (!extensions.length) return;
      const patch = () => {
        let definitions;
        try {
          definitions = ctx.documentPreviews.getSnapshot();
        } catch (error) {
          return;
        }
        const markdown = definitions.find(
          (definition) =>
            Array.isArray(definition.extensions) &&
            definition.extensions.includes("md") &&
            definition.extensions.includes("markdown"),
        );
        if (!markdown) return;
        for (const extension of extensions) {
          if (!markdown.extensions.includes(extension)) {
            markdown.extensions.push(extension);
          }
        }
      };
      patch();
      ctx.effect(() => ctx.documentPreviews.subscribe(patch));
    }

    const inject = ["documentPreviews"];

    function apply(ctx) {
      const configured = globalThis.__DSH_MARKDOWN_EXTENSIONS__;
      patchMarkdownExtensions(
        ctx,
        normalizeExtensions(configured === undefined ? DEFAULT_EXTENSIONS : configured),
      );
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
  },
});
