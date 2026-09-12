import * as Blockly from "blockly/core";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "github_workflow",
    message0: "Workflow name %1",
    args0: [
      {
        type: "field_input",
        name: "NAME",
        text: "enter name",
      },
    ],
    message1: "triggers %1",
    args1: [
      {
        type: "input_statement",
        name: "TRIGGERS",
        check: "Trigger",
      },
    ],
    message2: "env %1",
    args2: [
      {
        type: "input_statement",
        name: "ENV",
        check: "KeyValue",
      },
    ],
    message3: "jobs %1",
    args3: [
      {
        type: "input_statement",
        name: "JOBS",
        check: "Job",
      },
    ],
    colour: 230,
    tooltip: "A GitHub Actions workflow",
    helpUrl: "",
  },
]);
