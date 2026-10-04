import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export function configureGoogleAuth() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "client",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "secret",
        callbackURL: "/auth/google/callback",
      },
      (_accessToken, _refreshToken, profile, done) => {
        done(null, { id: profile.id, email: profile.emails?.[0]?.value });
      },
    ),
  );
  return passport;
}
