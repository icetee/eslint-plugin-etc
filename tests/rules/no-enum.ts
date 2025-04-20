import { stripIndent } from "common-tags";
import { fromFixture } from "@icetee/eslint-etc";
import rule from '../../source/rules/no-enum.js';
import { ruleTester } from "../utils.js";

ruleTester({ types: true }).run("no-enum", rule, {
  valid: [],
  invalid: [
    fromFixture(
      stripIndent`
        enum Numbers { one = 1 };
             ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        export enum Numbers { one = 1 };
                    ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        const enum Numbers { one = 1 };
                   ~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        export const enum Numbers { one = 1 };
                          ~~~~~~~ [forbidden]
      `
    ),
  ],
});
