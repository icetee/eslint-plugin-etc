import { stripIndent } from "common-tags";
import { fromFixture } from "@icetee/eslint-etc";
import rule from '../../source/rules/prefer-less-than.js';
import { ruleTester } from "../utils.js";

ruleTester({ types: false }).run("prefer-less-than", rule, {
  valid: [
    `const result = 42 < 54;`,
    `const result = 42 <= 54;`,
    `const result = 42 == 54;`,
    `const result = 42 === 54;`,
    `const result = 42 != 54;`,
    `const result = 42 !== 54;`,
    `if (a < x && x < b) { /* .. */ }`,
    `if (a <= x && x <= b) { /* .. */ }`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        const result = 54 > 42;
                       ~~~~~~~ [forbiddenGT suggest]
       `,
      {
        output: stripIndent`
          const result = 42 < 54;
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              const result = 42 < 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54 >= 42;
                       ~~~~~~~~ [forbiddenGTE suggest]
       `,
      {
        output: stripIndent`
          const result = 42 <= 54;
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              const result = 42 <= 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54.0 > 42;
                       ~~~~~~~~~ [forbiddenGT suggest]
       `,
      {
        output: stripIndent`
          const result = 42 < 54.0;
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              const result = 42 < 54.0;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54.0 >= 42;
                       ~~~~~~~~~~ [forbiddenGTE suggest]
       `,
      {
        output: stripIndent`
          const result = 42 <= 54.0;
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              const result = 42 <= 54.0;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54 > 42.0;
                       ~~~~~~~~~ [forbiddenGT suggest]
       `,
      {
        output: stripIndent`
          const result = 42.0 < 54;
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              const result = 42.0 < 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        const result = 54 >= 42.0;
                       ~~~~~~~~~~ [forbiddenGTE suggest]
       `,
      {
        output: stripIndent`
          const result = 42.0 <= 54;
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              const result = 42.0 <= 54;
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        if (x > a && x < b) { /* .. */ }
            ~~~~~ [forbiddenGT suggest]
       `,
      {
        output: stripIndent`
          if (a < x && x < b) { /* .. */ }
        `,
        suggestions: [
          {
            messageId: "suggestLT",
            output: stripIndent`
              if (a < x && x < b) { /* .. */ }
            `,
          },
        ],
      }
    ),
    fromFixture(
      stripIndent`
        if (x >= a && x <= b) { /* .. */ }
            ~~~~~~ [forbiddenGTE suggest]
       `,
      {
        output: stripIndent`
          if (a <= x && x <= b) { /* .. */ }
        `,
        suggestions: [
          {
            messageId: "suggestLTE",
            output: stripIndent`
              if (a <= x && x <= b) { /* .. */ }
            `,
          },
        ],
      }
    ),
  ],
});
