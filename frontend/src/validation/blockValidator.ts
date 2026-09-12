import Ajv from "ajv";
import { load } from "js-yaml";
import schema from "./github-actions-schema.json";

const ajv = new Ajv({
  allErrors: true,
  strict: false,
});

const validate = ajv.compile(schema);

export function validateWorkflow(yamlText: string) {
  try {
    const workflow = load(yamlText); // that we made

    const valid = validate(workflow);
    console.log("valid ===>", valid);

    if (valid) {
      return {
        valid: true,
        errors: [],
      };
    }

    return {
      valid: false,
      errors: validate.errors ?? [],
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          message: error instanceof Error ? error.message : "Invalid YAML",
        },
      ],
    };
  }
}
