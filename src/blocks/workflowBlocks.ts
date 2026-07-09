import * as Blockly from "blockly/core";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "github_workflow",
    message0: "Workflow name %1",
    args0: [
      {
        type: "field_input",
        name: "NAME",
        text: "Node CI",
      },
    ],
    message1: "triggers %1",
    args1: [
      {
        type: "input_statement",
        name: "TRIGGERS",
      },
    ],
    message2: "jobs %1",
    args2: [
      {
        type: "input_statement",
        name: "JOBS",
      },
    ],
    colour: 230,
    tooltip: "A GitHub Actions workflow",
    helpUrl: "",
  },
]);
