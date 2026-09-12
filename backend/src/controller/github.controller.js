import { githubService } from "../service/github.service.js";

const handleError = (res, error) => {
  if (error.isApiError) {
    return res.status(error.status).json(error.data);
  }
  console.error("GitHub request failed:", error);
  return res.status(502).json({ error: "Failed to reach the GitHub API" });
};

export const githubController = {
  async getBranches(req, res) {
    const { owner, repo } = req.params;
    const token = req.cookies.gh_token;
    if (!token) {
      return res.status(401).json({ error: "Login with GitHub required" });
    }
    try {
      const data = await githubService.getBranches(owner, repo, token);
      res.json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getRunners(req, res) {
    const { owner, repo } = req.params;
    const token = req.cookies.gh_token;
    if (!token) {
      return res.status(401).json({ error: "Login with GitHub required" });
    }
    try {
      const data = await githubService.getRunners(owner, repo, token);
      res.json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  async deployWorkflow(req, res) {
    const { owner, repo } = req.params;
    const { yaml, branch, message } = req.body;
    const token = req.cookies.gh_token;
    if (!token) {
      return res.status(401).json({ error: "Login with GitHub required" });
    }
    try {
      const data = await githubService.deployWorkflow(
        owner,
        repo,
        yaml,
        branch,
        message,
        token,
      );
      res.json(data);
    } catch (error) {
      handleError(res, error);
    }
  },
};
