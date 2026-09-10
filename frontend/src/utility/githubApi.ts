import { backendClient } from "./httpClient";

export const getWorkflowJob = async (
  owner: string,
  repo: string,
  jobId: string | number,
) => {
  const { data } = await backendClient.get(
    `/github/jobs/${owner}/${repo}/${jobId}`,
  );

  return data;
};
