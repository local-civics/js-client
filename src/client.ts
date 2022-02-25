import * as Sentry from "@sentry/browser";
import axios, { AxiosRequestConfig } from "axios";
import {
  badgeService,
  reflectionService,
  taskService,
  experienceService,
  registrationService,
} from "./curriculum";
import { actionService, reportService } from "./discovery";
import { communityService, residentService } from "./identity";

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
  accessToken?: string;
  majorVersion?: number;
  catch?: (err: any) => void;
}) => {
  /**
   * Headers sent with client
   */
  const headers: { [key: string]: any } = {};
  if (config?.accessToken) {
    headers["Authorization"] = `Bearer ${config?.accessToken}`;
  }

  /**
   * Environment the application is running
   */
  const apiURL = process.env.REACT_APP_API_URL;
  const client = axios.create({
    baseURL: (() => {
      if(!apiURL){
        return "https://dev.api.localcivics.io";
      }

      return apiURL;
    })(),
    timeout: 5000,
    headers: headers,
    paramsSerializer(params) {
      const searchParams = new URLSearchParams();
      for (const key of Object.keys(params)) {
        const param = params[key];
        if (Array.isArray(param)) {
          for (const p of param) {
            searchParams.append(key, p);
          }
        } else {
          searchParams.append(key, param);
        }
      }
      return searchParams.toString();
    }
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        error = new RequestError(
          error.response.status,
          error.response.data,
          error
        );
      }

      Sentry.captureException(error);

      if (config?.catch) {
        config.catch(error);
        return;
      }

      return Promise.reject(error);
    }
  );

  const major = config?.majorVersion || 0;
  const request = async (r: AxiosRequestConfig) => {
    try {
      const { data } = await client.request(r);
      return data;
    } catch (error) {
      if (config?.catch) {
        config.catch(error);
        return undefined;
      }
      throw error;
    }
  };

  const hoc = {
    request,
  };

  return {
    residents: residentService(hoc, major),
    experiences: experienceService(hoc, major),
    communities: communityService(hoc, major),
    registrations: registrationService(hoc, major),
    badges: badgeService(hoc, major),
    tasks: taskService(hoc, major),
    reflections: reflectionService(hoc, major),
    actions: actionService(hoc, major),
    reports: reportService(hoc, major),
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
