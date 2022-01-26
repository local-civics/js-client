import * as Sentry from "@sentry/browser";
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";

/**
 * The semver version of the library.
 */
export const version = require("../package.json").version;

/**
 * Api endpoint requester
 */
type api = (
  method: Method,
  path: string,
  query?: object,
  body?: object
) => Promise<AxiosResponse>;

/**
 * Setter for setting token
 */
type setToken = (token: string, ttl: number) => void;

/**
 * The client for accessing various APIs.
 * */
export const useApi: () => { api: api; setToken: setToken } = () => {
  const storage = window.localStorage;
  const token = (() => {
    const item = storage.getItem("token");
    if (item) {
      const now = new Date();
      const token = JSON.parse(item);
      if (now.getTime() < token.expiry) {
        return token.value;
      }
      storage.removeItem("token");
    }
    return "";
  })();

  const setToken = (token: string, ttl: number) => {
    const now = new Date();
    const item = {
      value: token,
      expiry: now.getTime() + ttl,
    };
    storage.setItem("token", JSON.stringify(item));
  };

  /**
   * Headers sent with client
   */
  const headers: { [key: string]: any } = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Environment the application is running
   */
  const environment = process.env.APP_ENV;

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

  const client = axios.create(config);
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    }
  );

  /**
   * Api to call
   * @param method
   * @param path
   * @param query
   * @param body
   */
  const api = async (
    method: Method,
    path: string,
    query?: object,
    body?: object
  ) => {
    const req: AxiosRequestConfig = {
      url: path,
      method: method,
      params: query,
      data: body,
    };

    const { data } = await client.request(req);
    return data;
  };

  return { api, setToken };
};
