import * as Blockly from "blockly/core";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "github_job",
    message0: "job id %1",
    args0: [
      {
        type: "field_input",
        name: "JOB_ID",
        text: "test",
      },
    ],
    message1: "runs on %1",
    args1: [
      {
        type: "field_dropdown",
        name: "RUNNER",
        options: [
          ["Ubuntu latest", "ubuntu-latest"],
          ["Windows latest", "windows-latest"],
          ["macOS latest", "macos-latest"],
        ],
      },
    ],
    message2: "steps %1",
    args2: [
      {
        type: "input_statement",
        name: "STEPS",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 200,
    tooltip: "A GitHub Actions job",
  },
]);
