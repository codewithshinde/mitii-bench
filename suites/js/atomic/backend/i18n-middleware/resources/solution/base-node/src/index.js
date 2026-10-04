import express from "express";

const CATALOG = {
  en: { greeting: "Hello" },
  es: { greeting: "Hola" },
  fr: { greeting: "Bonjour" },
};

function pickLocale(header) {
  const raw = String(header ?? "en").split(",")[0]?.trim() ?? "en";
  return raw.split("-")[0];
}

export function i18nMiddleware(req, res, next) {
  const locale = pickLocale(req.header("Accept-Language"));
  const dict = CATALOG[locale] ?? CATALOG.en;
  req.locale = locale;
  req.__ = (key) => dict[key] ?? key;
  next();
}

const app = express();
app.use(i18nMiddleware);
app.get("/hello", (req, res) => res.json({ message: req.__("greeting"), locale: req.locale }));

const port = Number(process.env.PORT || 0);
const server = app.listen(port, () => {
  const addr = server.address();
  if (addr && typeof addr === "object") console.log(`listening on ${addr.port}`);
});

export { app, server, CATALOG };
