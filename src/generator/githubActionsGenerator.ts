import * as Blockly from "blockly/core";

export const githubActionsYamlGenerator = new Blockly.CodeGenerator(
  "GitHubActionsYaml",
);

githubActionsYamlGenerator.scrub_ = function (block, code, thisOnly) {
  const nextBlock = block.nextConnection?.targetBlock();

  if (nextBlock && !thisOnly) {
    return code + githubActionsYamlGenerator.blockToCode(nextBlock);
  }

  return code;
};

githubActionsYamlGenerator.forBlock["github_workflow"] = function (
  block,
  generator,
) {
  const workflowName = block.getFieldValue("NAME");
  const triggers = generator.statementToCode(block, "TRIGGERS");
  const jobs = generator.statementToCode(block, "JOBS");

  return `name: ${workflowName}
on:
${triggers || "  workflow_dispatch:\n"}
jobs:
${jobs}`;
};

githubActionsYamlGenerator.forBlock["github_push_trigger"] = function (block) {
  const branch = block.getFieldValue("BRANCH");

  return `push:
  branches: [${branch}]
`;
};

githubActionsYamlGenerator.forBlock["github_job"] = function (
  block,
  generator,
) {
  const jobId = block.getFieldValue("JOB_ID");
  const runner = block.getFieldValue("RUNNER");
  const steps = generator.statementToCode(block, "STEPS");

  return `${jobId}:
  runs-on: ${runner}
  steps:
${steps || '    - run: echo "No steps added"\n'}`;
};

githubActionsYamlGenerator.forBlock["github_run_step"] = function (block) {
  const command = block.getFieldValue("COMMAND");

  return `- run: ${command}
`;
};

githubActionsYamlGenerator.forBlock["github_step"] = function (block) {
  const action = block.getFieldValue("ACTION");

  return `  - uses: ${action}
`;
};

githubActionsYamlGenerator.forBlock["github_run_step"] = function (block) {
  const command = block.getFieldValue("COMMAND");

  return `  - run: ${command}
`;
};
