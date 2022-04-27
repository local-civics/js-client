import * as Sentry from "@sentry/browser";
import axios from "axios";

/**
 * The semver version of the library.
 */
export const VERSION = require("../package.json").version;

/**
 * The API service name
 */
export type Service = "curriculum" | "identity" | "discovery" | "media";

/**
 * The API request method
 */
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * The client configuration
 */
export type ClientConfig = {
  gatewayURL?: string;
  version?: number;
  retries?: number;
  timeout?: number;
  onReject?: (err: any) => any;
};

/**
 * The API request options
 */
export type RequestOptions = {
  referrer: string;
  query?: any;
  body?: any;
  endpoint?: string;
};

/**
 * Type for the client.
 */
export type Client = {
  do: (
      method: Method,
      service: Service,
      endpoint: string,
      options?: RequestOptions
  ) => Promise<any>;
};

// The js client for Local Platform APIs
export const init = (accessToken?: string, config?: ClientConfig) => {
  const version = config?.version || 1;
  const headers: { [key: string]: any } = {};
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const timeout = config?.timeout || 5000;
  const client = axios.create({
    timeout: timeout,
    headers: headers,
    paramsSerializer: serializeParams,
  });

  client.interceptors.response.use(
    (response) => response.data,
    (error) => {
      let message: string = "";
      if (Object.keys(error.response.data).length > 0) {
        message = error.response.data;
      }

      if (error.response) {
        error = new RequestError(error.response.status, message, error);
      }

      const status = ErrorCode(error);
      if (!status || status > 499) {
        Sentry.captureException(error);
      }

      if (config?.onReject) {
        return config.onReject(error);
      }

      return Promise.reject(error);
    }
  );

  const api: Client = {
    do: async (
        method: Method,
        service: Service,
        endpoint: string,
        options?: RequestOptions
    ) => {
      const path = endpoint
          .split("/")
          .filter((dir) => dir)
          .join("/");
      return client.request({
        method,
        url: `/${service}/v${version}/${path}`,
        params: options?.query,
        data: options?.body,
        headers: options?.referrer ? { referrer: options.referrer } : undefined,
      });
    },
  }

  return api;
};

/**
 * Custom error object for request errors.
 */
class RequestError extends Error {
  public readonly cause: Error;
  public readonly code: number;
  public readonly message: string;

  constructor(code: number, message: string, cause?: Error) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.cause = this;
    if (cause) {
      this.cause = cause;
    }
    this.code = code;
    this.message = message;
  }
}

/**
 * Get error code
 * @param error
 * @constructor
 */
export const ErrorCode = (error: Error) => {
  let code: number = 0;
  if (error instanceof RequestError) {
    code = error.code;
  }
  return code;
};

/**
 * Get error message
 * @param error
 * @constructor
 */
export const ErrorMessage = (error: Error) => {
  let message: string = "";
  if (error instanceof RequestError) {
    message = error.message;
  }

  return message;
};

/**
 * Custom params serializer
 * @param params
 */
const serializeParams = (params: any) => {
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
};
