import { createContext, useContext, useState, type ReactNode } from "react";
import { githubCache } from "../utility/githubCache";
import { backendClient } from "../utility/httpClient";
import axios from "axios";

interface Runner {
  name: string;
}

interface Branch {
  name: string;
}

interface RunnersResponse {
  runners?: Runner[];
}
interface GitHubContextType {
  owner: string;
  repo: string;
  isSyncing: boolean;
  setRepository: (newOwner: string, newRepo: string) => void;
  fetchRepoData: (targetOwner: string, targetRepo: string) => Promise<void>;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider = ({ children }: { children: ReactNode }) => {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const setRepository = (newOwner: string, newRepo: string) => {
    setOwner(newOwner);
    setRepo(newRepo);
  };

  const fetchRepoData = async (
    targetOwner: string,
    targetRepo: string,
  ): Promise<void> => {
    if (!targetOwner || !targetRepo) return;

    setIsSyncing(true);
    try {
      const logError = (label: string, err: unknown) => {
        if (axios.isAxiosError(err)) {
          console.log(`error syncing ${label}`, err.response?.data);
        } else {
          console.error(`error syncing ${label}:`, err);
        }
      };

      const [runnersResult, branchesResult] = await Promise.allSettled([
        backendClient.get<RunnersResponse>(
          `/github/runners/repo/${targetOwner}/${targetRepo}`,
        ),
        backendClient.get<Branch[]>(
          `/github/branches/${targetOwner}/${targetRepo}`,
        ),
      ]);

      if (runnersResult.status === "fulfilled") {
        githubCache.runners =
          runnersResult.value.data.runners?.map((res) => res.name) ?? [];
      } else {
        logError("runners", runnersResult.reason);
      }

      if (branchesResult.status === "fulfilled") {
        const data = branchesResult.value.data;
        githubCache.branches = Array.isArray(data)
          ? data.map((res) => res.name)
          : ["main"];
      } else {
        logError("branches", branchesResult.reason);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <GitHubContext.Provider
      value={{ owner, repo, isSyncing, setRepository, fetchRepoData }}
    >
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => useContext(GitHubContext);
