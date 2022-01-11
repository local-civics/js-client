import { AxiosRequestConfig } from "axios";
import { calendar } from "./calendar";
import { footprint } from "./footprint";
import { identity } from "./identity";

/**
 * The semver version of the library.
 */
export const version = require("../package.json").version;

/**
 * The client for accessing various APIs.
 */
export const useClient = (token?: string, environment?: string) => {
  /**
   * Headers sent with client
   */
  const headers: { [key: string]: any } = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Axios config
   */
  const config: AxiosRequestConfig = {
    baseURL: (() => {
      if (!environment || environment === "prod") {
        return "https://api.localcivics.io";
      }

      return `https://${environment}.api.localcivics.io`;
    })(),
    timeout: 5000,
    headers: headers,
  };

  return {
    identity: identity(config),
    footprint: footprint(config),
    calendar: calendar(config),
  };
};
