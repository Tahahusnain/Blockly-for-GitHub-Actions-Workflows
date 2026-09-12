import { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import * as libraryBlocks from "blockly/blocks";
import { validateWorkflow } from "../validation/blockValidator";
import "../blocks/workflowBlocks";
import "../blocks/triggerBlocks";
import "../blocks/jobBlocks";
import "../blocks/stepBlocks";
import "../blocks/keyValueBlock";
import "../blocks/ifBlock";

import { githubActionsYamlGenerator } from "../generator/githubActionsGenerator";

Blockly.common.defineBlocks(libraryBlocks.blocks);
Blockly.Scrollbar.scrollbarThickness = 15;

type BlocklyEditorProp = {
  onYamlChange: (yaml: string) => void;
  onValidationChange: (errors: string[]) => void;
};

const BlocklyEditor = ({
  onYamlChange,
  onValidationChange,
}: BlocklyEditorProp) => {
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
              {
                kind: "block",
                type: "github_pull_request_trigger",
              },
              {
                kind: "block",
                type: "github_workflow_dispatch_trigger",
              },
              {
                kind: "block",
                type: "github_schedule_trigger",
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
                type: "github_uses_step",
              },
              {
                kind: "block",
                type: "github_run_step",
              },
            ],
          },
          {
            kind: "category",
            name: "Fields",
            contents: [
              {
                kind: "block",
                type: "github_if",
              },
              {
                kind: "block",
                type: "github_job_needs",
              },
              {
                kind: "block",
                type: "github_job_environment",
              },
              {
                kind: "block",
                type: "github_key_value",
              },
            ],
          },
        ],
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
    });

    const generateYaml = () => {
      const workflowBlock = workspace.getBlocksByType(
        "github_workflow",
        false,
      )[0];

      if (!workflowBlock) {
        onYamlChange("");
        onValidationChange([]);
        return;
      }

      githubActionsYamlGenerator.init(workspace);
      const code = githubActionsYamlGenerator.blockToCode(workflowBlock);
      const yaml = typeof code === "string" ? code : code[0];
      onYamlChange(yaml);

      const { errors } = validateWorkflow(yaml);
      console.log(errors);
      onValidationChange(
        errors.map((err) => err.message ?? "Invalid workflow"),
      );
    };

    workspace.addChangeListener(generateYaml);

    return () => {
      workspace.removeChangeListener(generateYaml);
      workspace.dispose();
    };
  }, []);

  return (
    <div
      ref={blocklyRef}
      className="h-[650px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg"
    />
  );
};

export default BlocklyEditor;
