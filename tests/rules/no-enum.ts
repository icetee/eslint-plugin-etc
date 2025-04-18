/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/icetee/eslint-plugin-etc
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-enum");
import { ruleTester } from "../utils";

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
