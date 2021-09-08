/* This standalone file appears unnecessary, but seems to be needed */
/* to allow us to do the 'require' trick in _app.tsx. Without this  */
/* file as is, using `getLoginData` elsewhere seems to cause webpack/next */
/* import errors. The use of it outside of _app gives a 'getLoginData is not */
/* a function' errors. */

import { getLoginData } from "utils/server/auth/user";
module.exports = getLoginData;
