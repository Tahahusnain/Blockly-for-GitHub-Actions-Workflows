import * as Blockly from "blockly/core";

Blockly.common.defineBlocksWithJsonArray([
  {
    type: "github_push_trigger",
    message0: "on push to branch %1",
    args0: [
      {
        type: "field_input",
        name: "BRANCH",
        text: "main",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 120,
  },
]);
