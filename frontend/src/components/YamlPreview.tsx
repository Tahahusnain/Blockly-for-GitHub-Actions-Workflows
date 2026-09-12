import { downloadTextFile } from "../utility/downloadTextFile";
import { useGitHub } from "../context/GitHubContext";
import { useState } from "react";
import { deployGitWorkflow } from "../utility/githubApi";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import type { AlertColor } from "@mui/material";

type YamlPreviewProps = {
  yaml: string;
  validationErrors: string[];
  notify: (message: string, severity?: AlertColor) => void;
};

const YamlPreview = ({ yaml, validationErrors, notify }: YamlPreviewProps) => {
  const github = useGitHub();
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployBranch, setDeployBranch] = useState("main");

  const isValid = validationErrors.length === 0;

  const branchOptions =
    github && github.branches.length ? github.branches : ["main"];
  const selectedBranch = branchOptions.includes(deployBranch)
    ? deployBranch
    : branchOptions[0];

  const handleDownload = (isValid: boolean): void => {
    // console.log(isValid);
    if (!yaml && !isValid) return;
    downloadTextFile(yaml, "main.yml");
  };

  //deploy github endpoint
  const handleDeployToGithub = async (isValid: boolean): Promise<void> => {
    if (!yaml && !isValid) return;
    if (!github?.owner || !github?.repo) {
      notify("Please enter both Owner and Repository name!", "warning");
      return;
    }
    setIsDeploying(true);

    try {
      const res = await deployGitWorkflow(
        github.owner,
        github.repo,
        yaml,
        selectedBranch,
      );
      notify(`Deployed to ${selectedBranch}: ${res.commit?.sha ?? "success"}`);
    } catch (error) {
      console.error("Deploy failed:", error);
      notify("Deploy failed — check console for details.", "error");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-3">
        <div className="min-w-0 ">
          <h2 className="text-lg font-semibold whitespace-nowrap text-slate-800">
            Generated YAML
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            className="rounded-lg bg-sky-600 px-4.5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
            onClick={() => handleDownload(isValid)}
            disabled={!yaml || !isValid}
          >
            Download YAML ↓
          </button>
          <Select
            value={selectedBranch}
            onChange={(e: SelectChangeEvent) => setDeployBranch(e.target.value)}
            disabled={!yaml || !isValid}
            size="small"
          >
            {branchOptions.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
          <button
            className="flex items-center gap-2 rounded-lg bg-sky-600 px-4.5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
            onClick={() => handleDeployToGithub(isValid)}
            disabled={!yaml || !isValid || isDeploying}
          >
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {isDeploying ? "Deploying…" : "Deploy to Github"}
          </button>
        </div>
      </div>
      <div className="relative">
        <pre className="m-0 h-auto overflow-x-auto bg-slate-950 p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-blue-100">
          {yaml || "Build a workflow to see YAML."}
        </pre>
        {yaml && (
          <span
            title={
              isValid ? "Workflow looks valid" : validationErrors.join("\n")
            }
            className={`absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white ${isValid ? "bg-green-600" : "bg-red-600"}`}
          >
            {isValid ? "✓" : "✗"}
          </span>
        )}
      </div>
    </section>
  );
};

export default YamlPreview;
