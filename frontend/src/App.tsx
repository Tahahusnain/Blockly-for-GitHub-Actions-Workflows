import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BlocklyEditor from "./components/BlocklyEditor";
import YamlPreview from "./components/YamlPreview";
import LoginPage from "./components/LoginPage";
import { useGitHub } from "./context/GitHubContext";
import { logoutUser } from "./utility/githubApi";
import "./App.css";
import { Alert, Snackbar, type AlertColor } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function Editor() {
  const [yaml, setYaml] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [owner, setOwner] = useState<string>("");
  const [repo, setRepo] = useState<string>("");
  const github = useGitHub();
  const navigate = useNavigate();

  // console.log("owner==repo name statessss==>", owner, repo);

  // console.log("github repo data ==>", github?.owner, github?.repo);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  const notify = (message: string, severity: AlertColor = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const handleOwnerChange = (val: string) => {
    setOwner(val);
    github?.setRepository(val, repo);
  };

  const handleRepoChange = (val: string) => {
    setRepo(val);
    github?.setRepository(owner, val);
  };

  const handleSyncRepository = async () => {
    if (!github?.owner || !github?.repo) {
      notify("Please enter both Owner and Repository name!", "warning");
      return;
    }

    const result = await github.fetchRepoData(github?.owner, github?.repo);
    // console.log(result);

    if (result.success) {
      notify(
        `Synced runners and branches for ${github.owner} / ${github.repo}!`,
      );
    } else {
      notify(result.error ?? "Failed to sync repository", "error");
    }

    setOwner("");
    setRepo("");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout request failed:", error);
    }
    github?.clearSession();
    navigate("/login");
  };

  return (
    <div className="relative mx-auto flex max-w-[1600px] px-0 flex-col gap-6 p-8">
      <button
        onClick={handleLogout}
        aria-label="Logout"
        className="absolute top-3 right-1 z-50 flex p-1 items-center justify-center rounded-sm bg-red-600 text-white shadow-md transition hover:bg-red-700 cursor-pointer"
      >
        <LogoutIcon fontSize="small" />
      </button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-green-500">
          Github Actions Blockly Generator
        </h1>

        <div className="flex mt-4 items-center gap-2">
          <input
            type="text"
            placeholder="Owner / Org"
            value={owner}
            onChange={(e) => handleOwnerChange(e.target.value)}
            className="bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
          <input
            type="text"
            placeholder="Repository"
            value={repo}
            onChange={(e) => handleRepoChange(e.target.value)}
            className="bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
          <button
            onClick={handleSyncRepository}
            disabled={github?.isSyncing}
            className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-green-700 disabled:bg-slate-400"
          >
            {github?.isSyncing ? "Syncing..." : "Sync Runners"}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <div className="w-full lg:flex-[1.55]">
          <BlocklyEditor
            onValidationChange={setValidationErrors}
            onYamlChange={setYaml}
          />
        </div>
        <div className="w-full lg:flex-[0.85]">
          <YamlPreview
            yaml={yaml}
            validationErrors={validationErrors}
            notify={notify}
          />
        </div>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Editor />} />
    </Routes>
  );
}

export default App;
