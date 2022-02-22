import * as Sentry from "@sentry/browser";
import axios                 from "axios";
import { badgeService, reflectionService, taskService, experienceService, registrationService } from "./curriculum";
import { actionService, reportService }                                from "./discovery";
import { communityService, residentService } from "./identity";

/**
 * The semver version of the library.
 */
export const version = require("../package.json").version;

// The js client for Local Platform APIs
export const client = (config?: {
  accessToken?: string;
  majorVersion?: number;
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
  const environment = process.env.APP_ENV;
  const client = axios.create({
    baseURL: (() => {
      if (environment === "docker") {
        return "http://localhost:8080";
      }

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
      if (error.response) {
        error = new RequestError(
          error.response.status,
          error.response.data,
          error
        );
      }

      Sentry.captureException(error);
      return Promise.reject(error);
    }
  );

  const major = config?.majorVersion || 0;
  return {
    residents: residentService(client, major),
    experiences: experienceService(client, major),
    communities: communityService(client, major),
    registrations: registrationService(client, major),
    badges: badgeService(client, major),
    tasks: taskService(client, major),
    reflections: reflectionService(client, major),
    actions: actionService(client, major),
    reports: reportService(client, major),
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
