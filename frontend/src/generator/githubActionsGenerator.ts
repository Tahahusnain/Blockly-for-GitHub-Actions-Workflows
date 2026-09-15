import * as Blockly from "blockly/core";

export const githubActionsYamlGenerator = new Blockly.CodeGenerator(
  "GitHubActionsYaml",
);

function indentExtra(code: string, spaces: number): string {
  if (!spaces) return code;
  const prefix = " ".repeat(spaces);
  return code
    .split("\n")
    .map((line) => (line ? prefix + line : line))
    .join("\n");
}

function getStepName(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
): { name: string; modifiers: string } {
  const firstOption = block.getInputTargetBlock("OPTIONS");

  if (!firstOption || firstOption.type !== "github_step_name") {
    return {
      name: "",
      modifiers: generator.statementToCode(block, "OPTIONS"),
    };
  }

  const name = firstOption.getFieldValue("NAME")?.trim() ?? "";
  const restBlock = firstOption.getNextBlock();
  const restCode = restBlock ? generator.blockToCode(restBlock) : "";
  const modifiers = indentExtra(
    typeof restCode === "string" ? restCode : restCode[0],
    2,
  );

  return { name, modifiers };
}

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
  const env = generator.statementToCode(block, "ENV");
  const jobs = generator.statementToCode(block, "JOBS");

  return `name: ${workflowName}

on:
${triggers || "  workflow_dispatch:\n"}${env.trim() ? `env:\n${env}` : ""}jobs:
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
  const hour = block.getFieldValue("HOUR");
  const minute = block.getFieldValue("MINUTE");
  const day = block.getFieldValue("DAY");
  const cron = `${minute} ${hour} * * ${day}`;

  return `schedule:
  - cron: '${cron}'
`;
};

githubActionsYamlGenerator.forBlock["github_job"] = function (
  block,
  generator,
) {
  const jobId = block.getFieldValue("JOB_ID");
  const runner = block.getFieldValue("RUNNER");
  const modifiers = generator.statementToCode(block, "OPTIONS");
  const env = generator.statementToCode(block, "ENV");
  const steps = generator.statementToCode(block, "STEPS");

  let code = `${jobId}:
${modifiers}`;

  if (env.trim()) {
    code += `  env:
${indentExtra(env, 2)}`;
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
  const { name, modifiers } = getStepName(block, generator);
  const inputs = generator.statementToCode(block, "WITH");
  const env = generator.statementToCode(block, "ENV");

  let code = name
    ? `  - name: ${name}\n    uses: ${action}\n`
    : `  - uses: ${action}\n`;
  code += indentExtra(modifiers, 2);

  if (inputs.trim()) {
    code += `    with:
${indentExtra(inputs, 4)}`;
  }

  if (env.trim()) {
    code += `    env:
${indentExtra(env, 4)}`;
  }

  return code;
};

githubActionsYamlGenerator.forBlock["github_run_step"] = function (
  block,
  generator,
) {
  const command = block.getFieldValue("COMMAND");
  const { name, modifiers } = getStepName(block, generator);
  const env = generator.statementToCode(block, "ENV");

  let code = name
    ? `  - name: ${name}\n    run: ${command}\n`
    : `  - run: ${command}\n`;

  code += indentExtra(modifiers, 2);

  if (env.trim()) {
    code += `    env:
${indentExtra(env, 4)}`;
  }

  return code;
};

githubActionsYamlGenerator.forBlock["github_job_needs"] = function (block) {
  const needs = block.getFieldValue("NEEDS")?.trim();
  return needs ? `needs: ${needs}\n` : "";
};

githubActionsYamlGenerator.forBlock["github_job_environment"] = function (
  block,
) {
  const environment = block.getFieldValue("ENVIRONMENT")?.trim();
  return environment ? `environment: ${environment}\n` : "";
};

githubActionsYamlGenerator.forBlock["github_if"] = function (block) {
  const condition = block.getFieldValue("IF")?.trim();
  return condition ? `if: ${condition}\n` : "";
};

githubActionsYamlGenerator.forBlock["github_step_name"] = function (block) {
  const name = block.getFieldValue("NAME")?.trim();
  return name ? `name: ${name}\n` : "";
};

githubActionsYamlGenerator.forBlock["github_key_value"] = function (block) {
  const key = block.getFieldValue("KEY");
  const value = block.getFieldValue("VALUE");

  return `${key}: ${value}\n`;
};
