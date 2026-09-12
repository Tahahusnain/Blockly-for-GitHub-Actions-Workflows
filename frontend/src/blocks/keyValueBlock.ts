import * as Blockly from "blockly/core";

Blockly.common.defineBlocks({
  github_key_value: {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField("key")
        .appendField(new Blockly.FieldTextInput("KEY"), "KEY")
        .appendField("value")
        .appendField(new Blockly.FieldTextInput("value"), "VALUE");

      this.setPreviousStatement(true, "KeyValue");
      this.setNextStatement(true, "KeyValue");
      this.setColour(60);
      this.setTooltip("A key: value pair (used in env: and with:)");
    },
  },
});
