import { useState } from "react";
import BlocklyEditor from "./components/BlocklyEditor";
import YamlPreview from "./components/YamlPreview";
import "./App.css";

function App() {
  const [yaml, setYaml] = useState("");

  return (
    <div className="app-layout">
      <h1>Github Actions Blockly Generator</h1>
      <BlocklyEditor onYamlChange={setYaml} />
      <YamlPreview yaml={yaml} />
    </div>
  );
}

export default App;
