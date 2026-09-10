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

      this.appendDummyInput()
        .appendField("if")
        .appendField(new Blockly.FieldTextInput(""), "IF");

      this.appendStatementInput("WITH")
        .setCheck("ActionInput")
        .appendField("with");

      this.setPreviousStatement(true, "Step");
      this.setNextStatement(true, "Step");
      this.setColour(40);
      this.setTooltip("Use a GitHub Action with optional inputs");
    },
  },

  github_action_input: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("key")
        .appendField(new Blockly.FieldTextInput("node-version"), "KEY")
        .appendField("value")
        .appendField(new Blockly.FieldTextInput("22"), "VALUE");

      this.setPreviousStatement(true, "ActionInput");
      this.setNextStatement(true, "ActionInput");
      this.setColour(60);
      this.setTooltip("Configure an input for a GitHub Action");
    },
  },

  github_run_step: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("run command")
        .appendField(new Blockly.FieldTextInput("npm test"), "COMMAND");

      this.appendDummyInput()
        .appendField("if")
        .appendField(new Blockly.FieldTextInput(""), "IF");

      this.setPreviousStatement(true, "Step");
      this.setNextStatement(true, "Step");
      this.setColour(40);
      this.setTooltip("Run a shell command");
    },
  },
});
