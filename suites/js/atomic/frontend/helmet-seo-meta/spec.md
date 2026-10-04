Build a page head manager using `react-helmet-async`.

* **Dynamic Props**: `title`, `description` — controlled via inputs (`data-testid="seo-title-input"`, `data-testid="seo-description-input"`).
* **Verification**: Document head contains updated `<title>` and `<meta name="description">` tags.

Wrap with `HelmetProvider` and render `Helmet` from the dynamic props.
