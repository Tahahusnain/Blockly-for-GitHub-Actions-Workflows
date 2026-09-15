import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { backendClient } from "../utility/httpClient";
import axios from "axios";

export const githubRunnersAndBranches: {
  runners: string[];
  branches: string[];
} = {
  runners: [],
  branches: [],
};

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
  runners: string[];
  branches: string[];
  setRepository: (newOwner: string, newRepo: string) => void;
  fetchRepoData: (
    targetOwner: string,
    targetRepo: string,
  ) => Promise<{ success: boolean; error?: string }>;
  clearSession: () => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export const GitHubProvider = ({ children }: { children: ReactNode }) => {
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [runners, setRunners] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    githubRunnersAndBranches.runners = runners;
    githubRunnersAndBranches.branches = branches;
  }, [runners, branches]);

  const setRepository = (newOwner: string, newRepo: string) => {
    setOwner(newOwner);
    setRepo(newRepo);
  };

  const clearSession = () => {
    setOwner("");
    setRepo("");
    setRunners([]);
    setBranches([]);
  };

  const fetchRepoData = async (
    targetOwner: string,
    targetRepo: string,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!targetOwner || !targetRepo) {
      return { success: false, error: "Owner and repository are required" };
    }

    setIsSyncing(true);
    try {
      const apiError = (label: string, err: unknown): string => {
        if (axios.isAxiosError(err)) {
          console.log(`error syncing ${label}`, err.response?.data);
          return (
            err.response?.data?.message ??
            `Failed to fetch ${label} (${err.response?.status ?? "network error"})`
          );
        }
        console.error(`error syncing ${label}:`, err);
        return `Failed to fetch ${label}`;
      };

      const [runnersResult, branchesResult] = await Promise.allSettled([
        backendClient.get<RunnersResponse>(
          `/github/runners/repo/${targetOwner}/${targetRepo}`,
        ),
        backendClient.get<Branch[]>(
          `/github/branches/${targetOwner}/${targetRepo}`,
        ),
      ]);

      let error: string | undefined;

      if (runnersResult.status === "fulfilled") {
        setRunners(
          runnersResult.value.data.runners?.map((res) => res.name) ?? [],
        );
      } else {
        error = apiError("runners", runnersResult.reason);
      }

      if (branchesResult.status === "fulfilled") {
        const data = branchesResult.value.data;
        setBranches(Array.isArray(data) ? data.map((res) => res.name) : []);
      } else {
        error = apiError("branches", branchesResult.reason);
      }

      if (
        runnersResult.status === "rejected" &&
        branchesResult.status === "rejected"
      ) {
        return {
          success: false,
          error: `Repository "${targetOwner}/${targetRepo}" not found or inaccessible`,
        };
      }

      return { success: true, error };
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <GitHubContext.Provider
      value={{
        owner,
        repo,
        isSyncing,
        runners,
        branches,
        setRepository,
        fetchRepoData,
        clearSession,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};

export const useGitHub = () => useContext(GitHubContext);
