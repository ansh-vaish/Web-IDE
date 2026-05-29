import { db } from "@/lib/db";
import {signOut} from "@/auth";

async function refreshGithubAccessToken(refreshToken: string) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",

    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      client_id: process.env.AUTH_GITHUB_ID,

      client_secret: process.env.AUTH_GITHUB_SECRET,

      grant_type: "refresh_token",

      refresh_token: refreshToken,
    }),
  });

  const tokens = await response.json();

  if (tokens.error) {
    throw new Error(`GitHub refresh failed: ${JSON.stringify(tokens)}`);
  }
  return tokens;
}

export async function getValidGithubAccessToken(userId: string) {
  const account = await db.account.findFirst({
    where: {
      userId,
      provider: "github",
    },
  });

  if (!account) {
    throw new Error("GitHub account not linked");
  }

  if (account.expires_at && Date.now() < account.expires_at * 1000) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw new Error("Missing GitHub refresh token");
  }

  const refreshedTokens = await refreshGithubAccessToken(account.refresh_token);

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
