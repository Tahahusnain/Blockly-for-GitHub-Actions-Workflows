import { githubRepository } from "../repository/github.repository.js";
import { createApiError } from "../utils/ApiError.js";

const yaml_file = ".github/workflows/generated.yml";

export const githubService = {
  async getBranches(owner, repo, token) {
    const result = await githubRepository.getBranches(owner, repo, token);
    if (!result.ok) {
      throw createApiError(result.status, result.data);
    }
    return result.data;
  },

  async getRunners(owner, repo, token) {
    const result = await githubRepository.getRunners(owner, repo, token);
    if (!result.ok) {
      throw createApiError(result.status, result.data);
    }
    return result.data;
  },

  async deployWorkflow(owner, repo, yaml, branch = "main", message, token) {
    if (!yaml) {
      throw createApiError(400, { error: "YAML content is required" });
    }

    const commitMessage = message ?? "Update generated GitHub Actions workflow";

    const existing = await githubRepository.getFileContent(
      owner,
      repo,
      yaml_file,
      branch,
      token,
    );

    let sha;
    if (existing.ok) {
      sha = existing.data.sha;
    } else if (existing.status !== 404) {
      throw createApiError(existing.status, existing.data);
    }

    const content = Buffer.from(yaml, "utf8").toString("base64");

    const result = await githubRepository.putFileContent(
      owner,
      repo,
      yaml_file,
      {
        message: commitMessage,
        content,
        branch,
        ...(sha ? { sha } : {}),
      },
      token,
    );

    if (!result.ok) {
      throw createApiError(result.status, result.data);
    }

    return {
      success: true,
      message: "Workflow deployed successfully",
      commit: result.data.commit,
    };
  },
};
