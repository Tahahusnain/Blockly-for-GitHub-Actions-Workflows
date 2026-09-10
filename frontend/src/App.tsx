import { useState } from "react";
import BlocklyEditor from "./components/BlocklyEditor";
import YamlPreview from "./components/YamlPreview";
import { useGitHub } from "./context/GitHubContext";
import "./App.css";

function App() {
  const [yaml, setYaml] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const github = useGitHub();

  const handleSyncRepository = async () => {
    if (!github?.owner || !github?.repo) {
      alert("Please enter both Owner and Repository name!");
      return;
    }

    await github.fetchRepoData(github.owner, github.repo);
    alert(`Synced runners and branches for ${github.owner}/${github.repo}!`);
  };

  return (
    <div className="mx-auto flex max-w-[1600px] px-0 flex-col gap-6 p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-green-500">
          Github Actions Blockly Generator
        </h1>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Owner / Org"
            value={github?.owner ?? ""}
            onChange={(e) =>
              github?.setRepository(e.target.value, github?.repo ?? "")
            }
            className="bg-white rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
          <input
            type="text"
            placeholder="Repository"
            value={github?.repo ?? ""}
            onChange={(e) =>
              github?.setRepository(github?.owner ?? "", e.target.value)
            }
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
          <YamlPreview yaml={yaml} validationErrors={validationErrors} />
        </div>
      </div>
    </div>
  );
}

export default App;
