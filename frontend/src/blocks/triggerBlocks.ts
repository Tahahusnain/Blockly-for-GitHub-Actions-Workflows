import * as Blockly from "blockly/core";
import { githubRunnersAndBranches } from "../context/GitHubContext";

function getBranches(): [string, string][] {
  if (githubRunnersAndBranches.branches.length > 0) {
    return githubRunnersAndBranches.branches.map((branch) => [branch, branch]);
  }
  return [["main", "main"]];
}

const HOURS: [string, string][] = Array.from({ length: 24 }, (_, h) => {
  const val = h.toString().padStart(2, "0");
  return [val, val];
});

const MINUTES: [string, string][] = ["00", "15", "30", "45"].map((m) => [m, m]);

const DAYS: [string, string][] = [
  ["Every day", "*"],
  ["Monday", "1"],
  ["Tuesday", "2"],
  ["Wednesday", "3"],
  ["Thursday", "4"],
  ["Friday", "5"],
  ["Saturday", "6"],
  ["Sunday", "0"],
  ["Weekdays (Mon–Fri)", "1-5"],
];

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
        .appendField("run at")
        .appendField(new Blockly.FieldDropdown(HOURS), "HOUR")
        .appendField(":")
        .appendField(new Blockly.FieldDropdown(MINUTES), "MINUTE")
        .appendField("on")
        .appendField(new Blockly.FieldDropdown(DAYS), "DAY");

      this.setPreviousStatement(true, "Trigger");
      this.setNextStatement(true, "Trigger");
      this.setColour(120);
      this.setTooltip("Run this workflow on a schedule");
    },
  },
});
