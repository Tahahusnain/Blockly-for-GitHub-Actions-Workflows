import * as Blockly from "blockly/core";
import { githubCache } from "../utility/githubCache";

function getBranches(): [string, string][] {
  if (githubCache.branches && githubCache.branches.length > 0) {
    return githubCache.branches.map((branch) => [branch, branch]);
  }
  return [["main", "main"]];
}

Blockly.common.defineBlocks({
  github_push_trigger: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("on push to branch")
        .appendField(new Blockly.FieldDropdown(getBranches), "BRANCH");

      this.setPreviousStatement(true, "Trigger");
      this.setNextStatement(true, "Trigger");
      this.setColour(120);
    },
  },
  github_pull_request_trigger: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("pull request")
        .appendField("branch")
        .appendField(new Blockly.FieldDropdown(getBranches), "BRANCH");

      this.setPreviousStatement(true, "Trigger");
      this.setNextStatement(true, "Trigger");
      this.setColour(120);
    },
  },
  github_workflow_dispatch_trigger: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput().appendField("manual trigger (workflow_dispatch)");

      this.setPreviousStatement(true, "Trigger");
      this.setNextStatement(true, "Trigger");
      this.setColour(120);
      this.setTooltip(
        "Lets you manually run this workflow from the Actions tab",
      );
    },
  },
  github_schedule_trigger: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("schedule")
        .appendField("cron")
        .appendField(new Blockly.FieldTextInput("0 9 * * 1"), "CRON");

      this.setPreviousStatement(true, "Trigger");
      this.setNextStatement(true, "Trigger");
      this.setColour(120);
    },
  },
});

// Blockly.common.defineBlocksWithJsonArray([
//   {
//     type: "github_push_trigger",
//     message0: "on push to branch %1",
//     args0: [
//       {
//         type: "field_input",
//         name: "BRANCH",
//         text: "main",
//       },
//     ],
//     previousStatement: null,
//     nextStatement: null,
//     colour: 120,
//   },
// ]);
