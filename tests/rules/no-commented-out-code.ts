import { stripIndent } from "common-tags";
import { fromFixture } from "@icetee/eslint-etc";
import rule from '../../source/rules/no-commented-out-code.js';
import { ruleTester } from "../utils.js";

ruleTester({ types: false }).run("no-commented-out-code", rule, {
  valid: [
    {
      code: stripIndent`
        // This comment isn't code.
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        // This comment includes some code:
        // const answer = 54;
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /* This comment isn't code. */
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /*
        This comment includes some code:
        const answer = 54;
        */
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /*
         * This comment isn't code.
         */
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        /*
         * This comment includes some code:
         * const answer = 54;
         */
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        // TODO
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        // TODO:
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        // TODO: fix
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        //
        const answer = 42;
      `,
    },
    {
      code: stripIndent`
        // https://github.com/icetee/eslint-plugin-etc/issues/28
        enum Data {
          // City
          Zero,
          // Город
          One,
          // 町
          Two,
          // İlçe
          Three,
          // Քաղաք
          Four,
        }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/icetee/eslint-plugin-etc/issues/32
        interface MyExample {
          // City
          a: string;
          /**
           * City
           */
          a1: string;
          // Город
          b: string;
          // 町
          c: string;
          // İlçe
          d: string;
          // Քաղաք
          e: string;
        }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/icetee/eslint-plugin-etc/issues/29
        class SomeClass {
          // #region Some region
          someMethod() {}
          // #endregion
        }
      `,
    },
    {
      code: stripIndent`
        // https://github.com/icetee/eslint-plugin-etc/issues/31
        /* webpackChunkName: 'my_component' */
        /* webpackMode: true */
        /* webpackPreload: true */
        /* webpackPrefetch: true */
      `,
    },
    {
      code: stripIndent`
        // https://github.com/icetee/eslint-plugin-etc/issues/33
        enum MyExample {
          // all-powerful
          Zero,
          /**
           * play-group
           */
          One,
          // and/or
          Two,
          /**
           * his/her
           */
          Three,
        }
      `,
    },
    {
      code: stripIndent`
        // 00000000-0000-0000-0000-000000000000
      `,
    },
    {
      code: stripIndent`
        // 42
      `,
    },
    {
      code: stripIndent`
        // true
      `,
    },
    {
      code: stripIndent`
        // arrange
        // act
        // assert
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // const answer = 54;
        ~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        const answer = 42;
      `
    ),
    fromFixture(
      stripIndent`
        /* const answer = 54; */
        ~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        const answer = 42;
      `
    ),
    {
      code: stripIndent`
        /*
         * const answer = 54;
         */
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 4,
          line: 1,
          endLine: 3,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        // // Wrong answer
        // const answer = 54;
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 22,
          line: 1,
          endLine: 2,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        // /* Wrong answer */
        // const answer = 54;
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 22,
          line: 1,
          endLine: 2,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        /*
        // Wrong answer
        const answer = 54;
        */
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 3,
          line: 1,
          endLine: 4,
          messageId: "forbidden",
        },
      ],
    },
    {
      code: stripIndent`
        /*
         * // Wrong answer
         * const answer = 54;
         */
        const answer = 42;
      `,
      errors: [
        {
          column: 1,
          endColumn: 4,
          line: 1,
          endLine: 4,
          messageId: "forbidden",
        },
      ],
    },
    fromFixture(
      stripIndent`
        // within array
        const outer = [
          a,
          // b,
          ~~~~~ [forbidden]
          c
        ];
      `
    ),
    fromFixture(
      stripIndent`
        // within class
        class Outer {
          public a: string;
          // public b: string;
          ~~~~~~~~~~~~~~~~~~~~ [forbidden]
          public c: string;
        }
      `
    ),
    fromFixture(
      stripIndent`
        // within import
        import {
          a,
          // b,
          ~~~~~ [forbidden]
          c
        } from "outer";
      `
    ),
    fromFixture(
      stripIndent`
        // within interface
        interface Outer {
          readonly a: string;
          // readonly b: string;
          ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
          readonly c: string;
        }
      `
    ),
    fromFixture(
      stripIndent`
        // within object
        const outer = {
          a: "a",
          // b: "b",
          ~~~~~~~~~~ [forbidden]
          c: "c"
        };
      `
    ),
    fromFixture(
      stripIndent`
        // within parameters
        function outer(
          a: string,
          // b: string,
          ~~~~~~~~~~~~~ [forbidden]
          c: string
        ) {};
      `
    ),
    fromFixture(
      stripIndent`
        // within switch
        switch (value) {
          case "a": return a;
          // case "b": return b;
          ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
          case "c": return c;
        };
      `
    ),
    fromFixture(
      stripIndent`
        // within type
        type Outer = {
          readonly a: string;
          // readonly b: string;
          ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
          readonly c: string;
        };
      `
    ),
  ],
});
