import * as Blockly from "blockly/core";

Blockly.common.defineBlocks({
  github_if: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("if")
        .appendField(new Blockly.FieldTextInput(""), "IF");

      this.setPreviousStatement(true, ["JobModifier", "StepModifier"]);
      this.setNextStatement(true, ["JobModifier", "StepModifier"]);
      this.setColour(190);
      this.setTooltip("A condition for a job or step to run");
    },
  },
});
