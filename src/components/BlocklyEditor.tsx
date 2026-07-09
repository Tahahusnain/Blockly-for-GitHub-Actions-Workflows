import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import * as libraryBlocks from "blockly/blocks";
import "../blocks/workflowBlocks";
import "../blocks/triggerBlocks";
import "../blocks/jobBlocks";
import "../blocks/stepBlocks";

import { githubActionsYamlGenerator } from "../generator/githubActionsGenerator";

Blockly.common.defineBlocks(libraryBlocks.blocks);

type BlocklyEditorProp = {
  onYamlChange: (yaml: string) => void;
};

const BlocklyEditor = ({ onYamlChange }: BlocklyEditorProp) => {
  const blocklyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!blocklyRef.current) return;

    const workspace = Blockly.inject(blocklyRef.current, {
      toolbox: {
        kind: "categoryToolbox",
        contents: [
          {
            kind: "category",
            name: "Workflow",
            contents: [
              {
                kind: "block",
                type: "github_workflow",
              },
            ],
          },
          {
            kind: "category",
            name: "Triggers",
            contents: [
              {
                kind: "block",
                type: "github_push_trigger",
              },
            ],
          },
          {
            kind: "category",
            name: "Jobs",
            contents: [
              {
                kind: "block",
                type: "github_job",
              },
            ],
          },
          {
            kind: "category",
            name: "Steps",
            contents: [
              {
                kind: "block",
                type: "github_step",
              },
            ],
          },
          {
            kind: "category",
            name: "Run",
            contents: [
              {
                kind: "block",
                type: "github_run_step",
              },
            ],
          },
        ],
      },
    });

    const generateYaml = () => {
      const yaml = githubActionsYamlGenerator.workspaceToCode(workspace);
      console.log(yaml);
      onYamlChange(yaml);
    };

    workspace.addChangeListener(generateYaml);

    return () => {
      workspace.removeChangeListener(generateYaml);
      workspace.dispose();
    };
  }, []);

  return <div ref={blocklyRef} className="blockly-editor" />;
};

export default BlocklyEditor;
