import * as Blockly from "blockly/core";

const COMMON_ACTIONS: [string, string][] = [
  ["Checkout Repository", "actions/checkout@v4"],
  ["Setup Node.js", "actions/setup-node@v4"],
  ["Setup Python", "actions/setup-python@v5"],
  ["Upload Artifact", "actions/upload-artifact@v4"],
];

Blockly.common.defineBlocks({
  github_uses_step: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("use action")
        .appendField(new Blockly.FieldDropdown(COMMON_ACTIONS), "ACTION");

      this.appendStatementInput("OPTIONS")
        .setCheck("stepOption")
        .appendField("options");

      this.appendStatementInput("WITH")
        .setCheck("KeyValue")
        .appendField("with");

      this.appendStatementInput("ENV")
        .setCheck("KeyValue")
        .appendField("env");

      this.setPreviousStatement(true, "Step");
      this.setNextStatement(true, "Step");
      this.setColour(40);
      this.setTooltip("Use a GitHub Action with optional inputs");
    },
  },

  github_run_step: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("run command")
        .appendField(new Blockly.FieldTextInput("npm test"), "COMMAND");

      this.appendStatementInput("OPTIONS")
        .setCheck("stepOption")
        .appendField("options");

      this.appendStatementInput("ENV")
        .setCheck("KeyValue")
        .appendField("env");

      this.setPreviousStatement(true, "Step");
      this.setNextStatement(true, "Step");
      this.setColour(40);
      this.setTooltip("Run a shell command");
    },
  },

  github_step_name: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("name")
        .appendField(new Blockly.FieldTextInput(""), "NAME");

      this.setPreviousStatement(true, "stepOption");
      this.setNextStatement(true, "stepOption");
      this.setColour(30);
      this.setTooltip("A display name for this step");
    },
  },
});
