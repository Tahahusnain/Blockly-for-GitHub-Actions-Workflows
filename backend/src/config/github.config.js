export const GITHUB_API_BASE = "https://api.github.com";

export const getGitHubHeaders = (token) => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "NodeJS-Express-Proxy",
});

export const githubOAuthConfig = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackUrl: `${process.env.SERVER_URL}/api/auth/callback`,
};
