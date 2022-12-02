import * as Sentry from "@sentry/browser";
import axios, { AxiosInstance } from "axios";

/**
 * The API service name
 */
export type ServiceName = "sphere" | "study" | "relay" | "lake";

/**
 * The API request method
 */
export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * The client configuration
 */
export type ClientConfig = {
  accessToken?: string;
  gatewayURL?: string;
  lakeURL?: string;
  version?: number;
  retries?: number;
  ttl?: number;
  onReject?: (err: any) => any;
};

/**
 * The API request options
 */
export type RequestOptions = {
  headers?: any;
  query?: any;
  body?: any;
};

/**
 * Client
 * The js client for Local Platform APIs
 */
export class Client {
  protected compassClient: AxiosInstance;
  protected lakeClient: AxiosInstance;
  protected version: number;
  protected accessToken: string;

  sphere: Service;
  study: Service;
  relay: Service;
  lake: Service;

  constructor(config?: ClientConfig) {
    this.version = config?.version || 1;
    this.accessToken = config?.accessToken || "";

    const headers: { [key: string]: any } = {};
    if (config?.accessToken) {
      headers["Authorization"] = `Bearer ${config.accessToken}`;
    }

    const timeout = config?.ttl || 30000;
    const compassClient = axios.create({
      baseURL: config?.gatewayURL,
      timeout: timeout,
      headers: headers,
      paramsSerializer: serializeParams,
    });

    const lakeClient = axios.create({
      baseURL: config?.lakeURL,
      timeout: timeout,
      headers: headers,
      paramsSerializer: serializeParams,
    });

    [compassClient, lakeClient].forEach(client => {
      client.interceptors.response.use(
          (response) => response.data,
          (error) => {
            let message: string = "";
            if (error.response && Object.keys(error.response.data).length > 0) {
              message = error.response.data;
            }

            if (error.response) {
              error = new RequestError(error.response.status, message, error);
            }

            const status = errorCode(error);
            if (!status || status > 499) {
              Sentry.captureException(error);
            }

            if (config?.onReject) {
              return config.onReject(error);
            }

            return Promise.reject(error);
          }
      );
    })

    this.compassClient = compassClient;
    this.lakeClient = lakeClient

    this.sphere = new Service("sphere", this.doCompass.bind(this));
    this.study = new Service("study", this.doCompass.bind(this));
    this.relay = new Service("relay", this.doCompass.bind(this));
    this.lake = new Service("lake", this.doLake.bind(this));
  }

  getAccessToken() {
    return this.accessToken;
  }

  doCompass(
    method: Method,
    service: ServiceName,
    endpoint: string,
    options: RequestOptions
  ) {
    const path = endpoint
      .split("/")
      .filter((dir) => dir)
      .join("/");
    return this.compassClient.request({
      method,
      url: `/${service}/v${this.version}/${path}`,
      params: options.query,
      data: options.body,
      headers: options.headers,
    }) as Promise<any>;
  }

  doLake(
      method: Method,
      service: ServiceName,
      endpoint: string,
      options: RequestOptions
  ) {
    const path = endpoint
        .split("/")
        .filter((dir) => dir)
        .join("/");
    return this.lakeClient.request({
      method,
      url: `/${path}`,
      params: options.query,
      data: options.body,
      headers: options.headers,
    }) as Promise<any>;
  }
}

/**
 * Access point for a platform services
 */
export class Service {
  name: ServiceName;
  handler: Handler;

  constructor(name: ServiceName, handler: Handler) {
    this.name = name;
    this.handler = handler;
  }

  get(endpoint: string, options?: RequestOptions) {
    return this.handler("GET", this.name, endpoint, {
      ...options,
    });
  }

  post(endpoint: string, options?: RequestOptions) {
    return this.handler("POST", this.name, endpoint, {
      ...options,
    });
  }

  put(endpoint: string, options?: RequestOptions) {
    return this.handler("PUT", this.name, endpoint, {
      ...options,
    });
  }

  patch(endpoint: string, options?: RequestOptions) {
    return this.handler("PATCH", this.name, endpoint, {
      ...options,
    });
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.handler("DELETE", this.name, endpoint, {
      ...options,
    });
  }
}

/**
 * Custom error object for request errors.
 */
class RequestError extends Error {
  public readonly cause: Error;
  public readonly code: number;
  public readonly message: string;

  /* istanbul ignore next */
  // https://github.com/gotwarlost/istanbul/issues/690
  constructor(code: number, message: string, cause?: Error) {
    super(message);

    Object.setPrototypeOf(this, RequestError.prototype);

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
export const errorCode = (error: Error) => {
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
export const errorMessage = (error: Error) => {
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

export type Handler = (method: Method, service: ServiceName, endpoint: string, options: RequestOptions) => Promise<any>;