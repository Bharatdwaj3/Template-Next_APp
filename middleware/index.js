import {authUser} from "./auth.middleware.js";
import {checkPermission} from "./permission.middleware.js";
import {roleMiddleware} from "./role.middleware.js";
import {
  setAccessToken,
  setRefreshToken,
  clearAuthCookies,
  revokeRefreshToken,
  refreshTokenHandler,
  cookieOpts
}
    from "./token.middleware.js";

import {dbMiddleware} from "./db.middleware.js";

export {
    authUser,
    checkPermission,
    roleMiddleware,
    setAccessToken,
    setRefreshToken,
    clearAuthCookies,
    revokeRefreshToken,
    refreshTokenHandler,
    cookieOpts,
    dbMiddleware
};