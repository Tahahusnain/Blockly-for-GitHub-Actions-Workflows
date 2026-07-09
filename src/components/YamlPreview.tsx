import { downloadTextFile } from "../utils/downloadTextFile";

type YamlPreviewProps = {
  yaml: string;
};

const YamlPreview = ({ yaml }: YamlPreviewProps) => {
  const handleDownload = (): void => {
    if (!yaml) return;
    downloadTextFile(yaml, "main.yml");
  };

  return (
    <section className="panel">
      <div className="panel-header yaml-panel-header">
        <div>
          <h2>Generated YAML</h2>
          <p>Preview of your workflow file</p>
        </div>
        <button
          className="download-btn"
          onClick={handleDownload}
          disabled={!yaml}
        >
          ↓ Download YAML
        </button>
      </div>
      <pre className="yaml-preview">
        {yaml || "Build a workflow to see YAML."}
      </pre>
    </section>
  );
};

export default YamlPreview;
