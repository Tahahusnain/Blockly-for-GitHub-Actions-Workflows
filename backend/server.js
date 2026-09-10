// backend/server.js
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const getGitHubHeaders = () => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${process.env.GIT_TOKEN}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "NodeJS-Express-Proxy",
});

// Branches on the repo, for the BRANCH dropdown.
app.get("/api/github/branches/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  console.log(owner, repo);
  try {
    const githubRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/branches`,
      { headers: getGitHubHeaders() },
    );

    const data = await githubRes.json();

    if (!githubRes.ok) {
      return res.status(githubRes.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("GitHub API request failed:", error);
    res.status(502).json({ error: "Failed to reach the GitHub API" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend connected successfully!" });
});

app.get("/api/github/jobs/:owner/:repo/:jobId", async (req, res) => {
  const { owner, repo, jobId } = req.params;

  try {
    const githubRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/jobs/${jobId}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${process.env.GIT_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    const data = await githubRes.json();

    if (!githubRes.ok) {
      return res.status(githubRes.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("GitHub API request failed:", error);
    res.status(502).json({ error: "Failed to reach the GitHub API" });
  }
});

// Self-hosted runners registered on the repo, for the RUNNER dropdown.
app.get("/api/github/runners/repo/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const githubRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/runners`,
      { headers: getGitHubHeaders() },
    );

    const data = await githubRes.json();
    console.log(data);
    if (!githubRes.ok) {
      return res.status(githubRes.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("GitHub API request failed:", error);
    res.status(502).json({ error: "Failed to reach the GitHub API" });
  }
});

//put

app.put("/api/github/workflow/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  const { yaml, branch = "main" } = req.body;
  console.log(owner, repo, yaml);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
