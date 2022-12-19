import * as Sentry                                       from "@sentry/browser";
import axios, {AxiosInstance} from "axios";
import {LRUMap} from "lru_map"

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
  timeout?: number;
  onError?: (err: any) => any;
};

/**
 * The API request options
 */
export type RequestOptions = {
  headers?: any;
  query?: any;
  body?: any;
  cache?: boolean
  validateStatus?: (status: number) => boolean
};

/**
 * Client
 * The js client for Local Platform APIs
 */
export class Client {
  protected compassClient: AxiosInstance;
  protected lakeClient: AxiosInstance;
  protected cache: LRUMap<any, any>;
  protected version: number;
  protected accessToken: string;
  protected onError?: (err: any) => any

  sphere: Service;
  study: Service;
  relay: Service;
  lake: Service;

  constructor(config?: ClientConfig) {
    config = config || {}

    this.version = config.version || 1;
    this.accessToken = config.accessToken || "";

    const headers: { [key: string]: any } = {};
    if (config.accessToken) {
      headers["Authorization"] = `Bearer ${config.accessToken}`;
    }

    const cache = new LRUMap(500)
    const timeout = config.timeout || 30000;
    const compassClient = axios.create({
      baseURL: config.gatewayURL,
      timeout: timeout,
      headers: headers,
      paramsSerializer: {indexes: null},
    });

    const lakeClient = axios.create({
      baseURL: config.lakeURL,
      timeout: timeout,
      headers: headers,
      paramsSerializer: {indexes: null},
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

            if (config?.onError) {
              return config.onError(error);
            }

            return Promise.reject(error);
          }
      );
    })

    this.onError = config.onError
    this.compassClient = compassClient;
    this.lakeClient = lakeClient
    this.cache = cache

    this.sphere = new Service("sphere", this.doCompass.bind(this));
    this.study = new Service("study", this.doCompass.bind(this));
    this.relay = new Service("relay", this.doCompass.bind(this));
    this.lake = new Service("lake", this.doLake.bind(this));
  }

  getAccessToken() {
    return this.accessToken;
  }

  async doCompass(
    method: Method,
    service: ServiceName,
    endpoint: string,
    options: RequestOptions
  ) {
    const path = endpoint
      .split("/")
      .filter((dir) => dir)
      .join("/");

    const now = new Date()
    const request = {
      method,
      url: `/${service}/v${this.version}/${path}`,
      params: options.query,
      data: options.body,
      headers: options.headers,
      validateStatus: options.validateStatus,
    }

    const requestKey = JSON.stringify(request)
    if(method === "GET" && options.cache) {
      const resp = this.cache.get(requestKey)
      if(resp){
        if(resp.ttl > now){
          return Promise.resolve(resp.data)
        }

        this.cache.delete(requestKey)
      }
    }

    try{
      return await this.compassClient.request(request).then(resp => {
        if(method === "GET" && options.cache){
            this.cache.set(requestKey, {
              data: resp,
              ttl: new Date(now.getTime() + 5*60000)
            })
        }

        return resp
      });
    } catch (e: any){
      const status = errorCode(e);
      if (!status || status > 499) {
        Sentry.captureException(e);
      }

      if(this.onError){
        return this.onError(e)
      }

      return Promise.reject(e)
    }
  }

  async doLake(
      method: Method,
      service: ServiceName,
      endpoint: string,
      options: RequestOptions
  ) {
    const path = endpoint
        .split("/")
        .filter((dir) => dir)
        .join("/");

    const now = new Date()
    const request = {
      method,
      url: `/${path}`,
      params: options.query,
      data: options.body,
      headers: options.headers,
      validateStatus: options.validateStatus,
    }

    const requestKey = JSON.stringify(request)
    if(method === "GET" && options.cache) {
      const resp = this.cache.get(requestKey)
      if(resp){
        if(resp.ttl > now){
          return Promise.resolve(resp.data)
        }

        this.cache.delete(requestKey)
      }
    }

    try{
      return await this.lakeClient.request(request).then(resp => {
        if(method === "GET" && options.cache){
          this.cache.set(requestKey, {
            data: resp,
            ttl: new Date(now.getTime() + 5*60000)
          })
        }

        return resp
      })
    } catch(e: any){
      const status = errorCode(e);
      if (!status || status > 499) {
        Sentry.captureException(e);
      }

      if(this.onError){
        return this.onError(e)
      }

      return Promise.reject(e)
    }
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
      validateStatus: (status) => status < 500,
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

export type Handler = (method: Method, service: ServiceName, endpoint: string, options: RequestOptions) => Promise<any>;