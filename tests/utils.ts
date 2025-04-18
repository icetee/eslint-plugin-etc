/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/icetee/eslint-plugin-etc
 */

import { createRuleTester } from "eslint-etc";
import { resolve } from "path";

export const ruleTester = createRuleTester({
  filename: resolve("./tests/file.tsx"),
});
