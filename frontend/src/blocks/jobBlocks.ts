import * as Blockly from "blockly/core";
import { githubCache } from "../utility/githubCache";

const getRunners = () => {
  const opt: [string, string][] = [
    ["Ubuntu latest (24.04)", "ubuntu-latest"],
    ["Ubuntu 22.04", "ubuntu-22.04"],
    ["Windows latest", "windows-latest"],
    ["Windows 2022", "windows-2022"],
    ["macOS latest (14)", "macos-latest"],
    ["macOS 13", "macos-13"],
  ];

  if (githubCache.runners && githubCache.branches.length > 0) {
    githubCache.runners.forEach((runner) => {
      opt.push([`Self-Hosted: ${runner}`, runner]);
    });
  }
  return opt;
};

Blockly.common.defineBlocks({
  github_job: {
    init: function (this: Blockly.Block) {
      //job-id
      this.appendDummyInput()
        .appendField("job id")
        .appendField(new Blockly.FieldTextInput("test"), "JOB_ID");

      //runs-on
      this.appendDummyInput()
        .appendField("runs on")
        .appendField(new Blockly.FieldDropdown(getRunners), "RUNNER");

      //needs
      this.appendDummyInput()
        .appendField("needs")
        .appendField(new Blockly.FieldTextInput(""), "NEEDS");

      //if
      this.appendDummyInput()
        .appendField("if")
        .appendField(new Blockly.FieldTextInput(""), "IF");
      //ENVIRONMENT
      this.appendDummyInput()
        .appendField("environment")
        .appendField(new Blockly.FieldTextInput(""), "ENVIRONMENT");
      //steps
      this.appendStatementInput("STEPS").setCheck("Step").appendField("steps");

      this.setPreviousStatement(true, "Job");
      this.setNextStatement(true, "Job");
      this.setColour(200);
      this.setTooltip("A GitHub Actions job");
    },
  },
});
