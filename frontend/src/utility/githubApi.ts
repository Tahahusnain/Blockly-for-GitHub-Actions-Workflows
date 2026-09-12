import { backendClient } from "./httpClient";

export const deployGitWorkflow = async (
  owner: string,
  repo: string,
  yaml: string,
  branch: string,
) => {
  const res = await backendClient.put(`/github/workflow/${owner}/${repo}`, {
    yaml,
    branch,
  });
  return res.data;
};

export const logoutUser = async () => {
  const res = await backendClient.post("/auth/logout");
  return res.data;
};
