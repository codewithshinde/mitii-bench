import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "refresh-secret");
const refreshStore = new Map();

export async function issueTokenPair(sub) {
  const access = await new jose.SignJWT({ sub })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);
  const refresh = crypto.randomUUID();
  refreshStore.set(refresh, { sub, revoked: false });
  return { accessToken: access, refreshToken: refresh };
}

export async function refreshTokens(refreshToken) {
  const entry = refreshStore.get(refreshToken);
  if (!entry || entry.revoked) throw new Error("Invalid refresh token");
  entry.revoked = true;
  return issueTokenPair(entry.sub);
}

export function revokeRefreshToken(refreshToken) {
  const entry = refreshStore.get(refreshToken);
  if (entry) entry.revoked = true;
}
