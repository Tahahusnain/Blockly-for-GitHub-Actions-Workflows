export const authRepository = {
  async exchangeCodeToken({ clientId, clientSecret, code }) {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    return res.json();
  },

  async getAuthenticatedUser(accessToken) {
    const res = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "NodeJS-Express-Proxy",
      },
    });
    return res.json();
  },
};
