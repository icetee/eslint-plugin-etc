import { stripIndent } from "common-tags";
import { fromFixture } from "@icetee/eslint-etc";
import rule from '../../source/rules/no-const-enum.js';
import { ruleTester } from "../utils.js";

ruleTester({ types: true }).run("no-const-enum", rule, {
  valid: [
    {
      code: `enum Numbers { one = 1 };`,
    },
    {
      code: `const enum Numbers { one = 1 };`,
      options: [
        {
          allowLocal: true,
        },
      ],
    },
  ],
  invalid: [
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
    fromFixture(
      stripIndent`
        export const enum Numbers { one = 1 };
                          ~~~~~~~ [forbidden]
      `,
      {
        options: [
          {
            allowLocal: false,
          },
        ],
      }
    ),
  ],
});
