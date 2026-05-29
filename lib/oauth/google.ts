import { db } from "@/lib/db";

async function refreshGoogleAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,

      grant_type: "refresh_token",

      refresh_token: refreshToken,
    }),
  });

  const tokens = await response.json();

  if (!response.ok) {
    throw new Error(`Google refresh failed: ${JSON.stringify(tokens)}`);
  }

  return tokens;
}

export async function getValidGoogleAccessToken(userId: string) {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });

  if (!account) {
    throw new Error("Google account not linked");
  }

  if (account.expires_at && Date.now() < account.expires_at * 1000) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw new Error("Missing Google refresh token");
  }

  const refreshedTokens = await refreshGoogleAccessToken(account.refresh_token);

  const newExpiresAt =
    Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;

  await db.account.update({
    where: {
      id: account.id,
    },

    data: {
      access_token: refreshedTokens.access_token,

      expires_at: newExpiresAt,

      refresh_token: refreshedTokens.refresh_token ?? account.refresh_token,
    },
  });

  return refreshedTokens.access_token;
}
