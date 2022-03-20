import * as Sentry from "@sentry/browser";
import axios, { AxiosRequestConfig } from "axios";
import { identityService, curriculumService } from "./api";

/**
 * The semver version of the library.
 */
export const version = require("../package.json").version;

/**
 * Type for the client.
 */
export type Client = ReturnType<typeof client>;

// The js client for Local Platform APIs
export const client = (config?: {
  apiURL?: string;
  accessToken?: string;
  majorVersion?: number;
  onReject?: (err: any) => any;
}) => {
  /**
   * Headers sent with client
   */
  const headers: { [key: string]: any } = {};
  if (config?.accessToken) {
    headers["Authorization"] = `Bearer ${config?.accessToken}`;
  }

  const client = axios.create({
    baseURL: (() => {
      if (!config?.apiURL) {
        return "https://dev.api.localcivics.io";
      }

      return config.apiURL;
    })(),
    timeout: 5000,
    headers: headers,
    paramsSerializer(params) {
      const searchParams = new URLSearchParams();
      for (const key of Object.keys(params)) {
        const param = params[key];
        if (Array.isArray(param)) {
          for (const p of param) {
            if (p === "undefined" || p === "null" || !p) {
              continue;
            }
            searchParams.append(key, p);
          }
        } else if (!(param === "undefined" || param === "null" || !param)) {
          searchParams.append(key, param);
        }
      }
      return searchParams.toString();
    },
  });

  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        error = new RequestError(
          error.response.status,
          error.response.data,
          error
        );
      }

      Sentry.captureException(error);

      if (config?.onReject) {
        return config.onReject(error);
      }

      return Promise.reject(error);
    }
  );

  const major = config?.majorVersion || 0;
  const request = async (r: AxiosRequestConfig) =>
    client.request(r).catch((e) => {
      if (config?.onReject) {
        return config.onReject(e);
      }
      return Promise.reject(e);
    });

  const hoc = {
    request,
  };

  return {
    identity: identityService(hoc, major),
    curriculum: curriculumService(hoc, major),
  };
};

/**
 * Custom error object for request errors.
 */
class RequestError extends Error {
  public readonly cause: Error;
  public readonly code: number;

  constructor(code: number, message: string, cause?: Error) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.code = code;
    this.cause = cause || this;
  }
}

/**
 * Check if error is not authorized.
 * @param error
 * @constructor
 */
export const IsNotAuthorized = (error: Error) => {
  return error instanceof RequestError && error.code === 401;
};

/**
 * Check if error is bad request.
 * @param error
 * @constructor
 */
export const IsBadRequest = (error: Error) => {
  return error instanceof RequestError && error.code === 400;
};

/**
 * Check if error is not found.
 * @param error
 * @constructor
 */
export const IsNotFound = (error: Error) => {
  return error instanceof RequestError && error.code === 404;
};
