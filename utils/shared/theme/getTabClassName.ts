/* Copied from https://github.com/segmentio/evergreen/blob/master/src/theme/src/default-theme/component-specific/getTabClassName.js */
/* Orignal values are left as comments next to their overwritten value */

// @ts-nocheck
import { Themer } from "evergreen-ui/commonjs/themer";
import memoizeClassName from "evergreen-ui/commonjs/theme/src/default-theme/utils/memoizeClassName";
import scales from "evergreen-ui/commonjs/theme/src/default-theme/foundational-styles/scales";
import { defaultControlStyles } from "evergreen-ui/commonjs/theme/src/default-theme/shared";

/**
 * Disabled styles are all the same.
 */
const { disabled } = defaultControlStyles

const defaultAppearance = Themer.createTabAppearance({
  base: {},
  hover: {
    backgroundColor: scales.neutral.N2A
  },
  focus: {
    boxShadow: `0 0 0 2px ${scales.neutral.N4A}`
  },
  active: {
    backgroundColor: scales.neutral.N4A,
    // color: scales.blue.B9
  },
  disabled,
  current: {}
})

/**
 * Get the appearance of a `Tab`.
 * @param {string} appearance
 * @return {string} the appearance object.
 */
const getTabAppearance = () => {
  return defaultAppearance
}

/**
 * Get the className of a `Tab`.
 * @param {string} appearance
 * @return {string} the appearance class name.
 */
export default memoizeClassName(getTabAppearance)
