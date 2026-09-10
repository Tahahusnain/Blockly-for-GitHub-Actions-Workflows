import { downloadTextFile } from "../utility/downloadTextFile";

type YamlPreviewProps = {
  yaml: string;
  validationErrors: string[];
};

const YamlPreview = ({ yaml, validationErrors }: YamlPreviewProps) => {
  const isValid = validationErrors.length === 0;
  const handleDownload = (): void => {
    if (!yaml) return;
    downloadTextFile(yaml, "main.yml");
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
        <div>
          <h2 className="m-0 text-lg font-semibold text-slate-800">
            Generated YAML
          </h2>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Preview of your workflow file
          </p>
        </div>
        <button
          className="shrink-0 rounded-lg bg-linear-to-br from-blue-900 to-slate-900 px-4.5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none disabled:hover:translate-y-0"
          onClick={handleDownload}
          disabled={!yaml}
        >
          ↓ Download YAML
        </button>
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
