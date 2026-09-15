import Ajv, { type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import axios from "axios";
import { load } from "js-yaml";

const GITHUB_ACTIONS_SCHEMA_URL =
  "https://www.schemastore.org/github-workflow.json";

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});
addFormats(ajv);

let validateFn: ValidateFunction | null = null;

export async function workflowValidator() {
  if (validateFn) return validateFn;

  try {
    //getting the schema from github
    const response = await axios.get(GITHUB_ACTIONS_SCHEMA_URL);
    validateFn = ajv.compile(response.data);
    return validateFn;
  } catch (error) {
    console.error("Failed to fetch GitHub Actions schema:", error);
    return null;
  }
}

const invalid = (message: string) => ({ valid: false, errors: [{ message }] });
//validating function
export function validateWorkflow(yamlText: string) {
  if (!validateFn) return invalid("Validator not initialized yet.");
  try {
    const workflow = load(yamlText);
    if (!workflow || typeof workflow !== "object") {
      return invalid("Empty or invalid YAML format.");
    }
    //calling validate funtion
    const valid = validateFn(workflow);
    return { valid, errors: validateFn.errors ?? [] };
  } catch (error) {
    return invalid(error instanceof Error ? error.message : "Invalid YAML");
  }
}
