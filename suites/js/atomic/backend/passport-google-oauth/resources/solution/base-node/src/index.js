import express from "express";
import session from "express-session";
import { configureGoogleAuth } from "./auth/google.js";

const passport = configureGoogleAuth();
export const app = express();
app.use(session({ secret: "mitii", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (_req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 0);
export const server = app.listen(port, () => {
  const address = server.address();
  if (address && typeof address === "object") console.log(`listening on ${address.port}`);
});
