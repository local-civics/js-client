import * as Sentry from "@sentry/browser";
import axios, { AxiosRequestConfig, Method } from "axios";

/**
 * The semver version of the library.
 */
export const version = require("../package.json").version;

/**
 * The client for accessing various APIs.
 * */
export const request = async (accessToken: string | null, method: Method, path: string, config?: AxiosRequestConfig) => {
  /**
   * Headers sent with client
   */
  const headers: { [key: string]: any } = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  /**
   * Environment the application is running
   */
  const environment = process.env.APP_ENV;
  const client = axios.create({
    baseURL: (() => {
      if (!environment || environment === "prod") {
        return "https://api.localcivics.io";
      }

      return `https://${environment}.api.localcivics.io`;
    })(),
    timeout: 5000,
    headers: headers,
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    }
  );

  const req = config || {}
  req.url = path
  req.method = method
  const { data } = await client.request(req);
  return data;
};
