import * as Blockly from "blockly/core";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "github_run_step",
    message0: "run command %1",
    args0: [
      {
        type: "field_input",
        name: "COMMAND",
        text: "npm test",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 40,
    tooltip: "Run a shell command in the GitHub Actions job",
  },
  {
    type: "github_step",
    message0: "use action %1",
    args0: [
      {
        type: "field_input",
        name: "ACTION",
        text: "actions/checkout@v6",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 40,
    tooltip: "Use GitHub Action",
  },
  {
    type: "github_run_step",
    message0: "run command %1",
    args0: [
      {
        type: "field_input",
        name: "COMMAND",
        text: "npm test",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 60,
  },

]);