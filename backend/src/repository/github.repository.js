import { GITHUB_API_BASE, getGitHubHeaders } from "../config/github.config.js";

export const githubRepository = {
  async getBranches(owner, repo, token) {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/branches`,
      { headers: getGitHubHeaders(token) },
    );
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async getRunners(owner, repo, token) {
    console.log(owner, repo);
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/runners`,
      { headers: getGitHubHeaders(token) },
    );
    console.log(res);
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async getFileContent(owner, repo, path, branch, token) {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      { headers: getGitHubHeaders(token) },
    );
    return { ok: res.ok, status: res.status, data: await res.json() };
  },

  async putFileContent(owner, repo, path, body, token) {
    const res = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          ...getGitHubHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    return { ok: res.ok, status: res.status, data: await res.json() };
  },
};
