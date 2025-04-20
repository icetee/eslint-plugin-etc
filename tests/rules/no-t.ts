import { stripIndent } from "common-tags";
import { fromFixture } from "@icetee/eslint-etc";
import rule from '../../source/rules/no-t.js';
import { ruleTester } from "../utils.js";

ruleTester({ types: true }).run("no-t", rule, {
  valid: [
    {
      code: `type Thing<Value> = { value: Value };`,
    },
    {
      code: `type Thing<TValue> = { value: TValue };`,
      options: [{ prefix: "T" }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        type Thing<T> = { value: T };
                   ~ [forbidden { "name": "T" }]
      `
    ),
    fromFixture(
      stripIndent`
        type Thing<Value> = { value: Value };
                   ~~~~~ [prefix { "name": "Value", "prefix": "T" }]
      `,
      { options: [{ prefix: "T" }] }
    ),
  ],
});
