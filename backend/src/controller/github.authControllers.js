import { authService } from "../service/auth.service.js";

export const authController = {
  async login(req, res) {
    const state = authService.createState();
    res.cookie("oauth_state", state, {
      httpOnly: true,
      secure: true,
    });
    res.redirect(authService.getAuthorizeUrl(state));
  },

  async callback(req, res) {
    const { code, state } = req.query;
    if (!state || state !== req.cookies.oauth_state) {
      return res.status(403).json({ error: "Invalid OAuth state" });
    }

    try {
      const { accessToken } = await authService.handleCallback(code);
      res.cookie("gh_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
      res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      console.error("OAuth callback failed:", error);
      res.status(502).json({ error: "GitHub OAuth failed" });
    }
  },

  logout(req, res) {
    res.clearCookie("gh_token");
    res.clearCookie("oauth_state");
    res.json({ success: true });
  },
};
