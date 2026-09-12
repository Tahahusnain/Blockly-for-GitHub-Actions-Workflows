import crypto from "crypto";
import { githubOAuthConfig } from "../config/github.config.js";
import { createApiError } from "../utils/ApiError.js";
import { authRepository } from "../repository/auth.repository.js";

export const authService = {
  createState() {
    return crypto.randomBytes(16).toString("hex");
  },

  getAuthorizeUrl(state) {
    const params = new URLSearchParams({
      client_id: githubOAuthConfig.clientId,
      redirect_uri: githubOAuthConfig.callbackUrl,
      scope: "repo workflow",
      state,
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  },

  async handleCallback(code) {
    const tokenData = await authRepository.exchangeCodeToken({
      clientId: githubOAuthConfig.clientId,
      clientSecret: githubOAuthConfig.clientSecret,
      code,
    });

    if (!tokenData.access_token) {
      throw createApiError(400, tokenData);
    }

    const user = await authRepository.getAuthenticatedUser(
      tokenData.access_token,
    );

    return { accessToken: tokenData.access_token, user };
  },
};
