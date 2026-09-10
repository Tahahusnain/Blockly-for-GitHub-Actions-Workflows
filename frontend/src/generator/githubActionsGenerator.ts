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
${triggers || "  workflow_dispatch:\n"}jobs:
${jobs}`;
};

githubActionsYamlGenerator.forBlock["github_push_trigger"] = function (block) {
  const branch = block.getFieldValue("BRANCH");

  return `push:
  branches: [${branch}]
`;
};

githubActionsYamlGenerator.forBlock["github_pull_request_trigger"] = function (
  block,
) {
  const branch = block.getFieldValue("BRANCH");

  return `pull_request:
  branches: [${branch}]
`;
};

githubActionsYamlGenerator.forBlock["github_workflow_dispatch_trigger"] =
  function () {
    return `workflow_dispatch:
`;
  };

githubActionsYamlGenerator.forBlock["github_schedule_trigger"] = function (
  block,
) {
  const cron = block.getFieldValue("CRON");

  return `schedule:
  - cron: "${cron}"
`;
};

githubActionsYamlGenerator.forBlock["github_job"] = function (
  block,
  generator,
) {
  const jobId = block.getFieldValue("JOB_ID");
  const runner = block.getFieldValue("RUNNER");
  const needs = block.getFieldValue("NEEDS")?.trim();
  const condition = block.getFieldValue("IF")?.trim();
  const environment = block.getFieldValue("ENVIRONMENT")?.trim();
  const steps = generator.statementToCode(block, "STEPS");

  let code = `${jobId}:
`;

  if (needs) {
    code += `  needs: ${needs}
`;
  }

  if (condition) {
    code += `  if: ${condition}\n`;
  }

  if (environment) {
    code += `  environment: ${environment}\n`;
  }

  code += `  runs-on: ${runner}
  steps:
${steps || '    - run: echo "No steps added"\n'}`;

  return code;
};

githubActionsYamlGenerator.forBlock["github_uses_step"] = function (
  block,
  generator,
) {
  const action = block.getFieldValue("ACTION");
  const condition = block.getFieldValue("IF")?.trim();
  const inputs = generator.statementToCode(block, "WITH");

  let code = `  - uses: ${action}\n`;

  if (condition) {
    code += `    if: ${condition}\n`;
  }

  if (inputs.trim()) {
    code += `    with:
${inputs}`;
  }

  return code;
};

githubActionsYamlGenerator.forBlock["github_run_step"] = function (block) {
  const command = block.getFieldValue("COMMAND");
  const condition = block.getFieldValue("IF")?.trim();

  let code = `  - run: ${command}\n`;

  if (condition) {
    code += `    if: ${condition}\n`;
  }

  return code;
};

githubActionsYamlGenerator.forBlock["github_action_input"] = function (block) {
  const key = block.getFieldValue("KEY");
  const value = block.getFieldValue("VALUE");

  return `    ${key}: ${value}\n`;
};
