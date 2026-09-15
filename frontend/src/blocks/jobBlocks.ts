import * as Blockly from "blockly/core";
import { githubRunnersAndBranches } from "../context/GitHubContext";

const getRunners = () => {
  const opt: [string, string][] = [
    ["Ubuntu latest", "ubuntu-latest"],
    ["Windows latest", "windows-latest"],
    ["macOS latest", "macos-latest"],
  ];

  githubRunnersAndBranches.runners.forEach((runner) => {
    opt.push([`Self-Hosted: ${runner}`, runner]);
  });
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

      this.appendStatementInput("OPTIONS")
        .setCheck("jobOption")
        .appendField("options");
      this.appendStatementInput("ENV").setCheck("KeyValue").appendField("env");
      this.appendStatementInput("STEPS").setCheck("Step").appendField("steps");

      this.setPreviousStatement(true, "Job");
      this.setNextStatement(true, "Job");
      this.setColour(200);
      this.setTooltip("A GitHub Actions job");
    },
  },

  github_job_needs: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("needs")
        .appendField(new Blockly.FieldTextInput(""), "NEEDS");

      this.setPreviousStatement(true, "jobOption");
      this.setNextStatement(true, "jobOption");
      this.setColour(210);
      this.setTooltip("The job(s) this job depends on");
    },
  },

  github_job_environment: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("environment")
        .appendField(new Blockly.FieldTextInput(""), "ENVIRONMENT");

      this.setPreviousStatement(true, "jobOption");
      this.setNextStatement(true, "jobOption");
      this.setColour(170);
      this.setTooltip("The deployment environment for this job");
    },
  },
});
