/**
 * Identity API service
 * @param axios
 * @returns
 */
import axios, { AxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/browser";

/**
 * Identity
 */
export interface Identity {
  identityId?: string;
  openId?: string;
  network?: string[];
  email?: string;
  givenName?: string;
  familyName?: string;
  role?: string;
  roleDescription?: string;
  grade?: string;
  gradeDescription?: string;
  interests?: string[];
  statement?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  permissions?: string[];
}

/**
 * Community
 */
export interface Community {
  communityId?: string;
  code?: string;
  name?: string;
  city?: string;
  state?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create an identity service instance
 * @param config
 */
export const identity: (config?: AxiosRequestConfig) => IdentityService = (
  config?: AxiosRequestConfig
) => {
  const client = axios.create({
    ...config,
    baseURL: `${config?.baseURL || ""}/identity/v0`,
  });
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    }
  );
  return {
    resolve: async (fields?: string[]) => {
      const config: AxiosRequestConfig = { params: { fields: fields } };
      const { data } = await client.get("/resolve", config);
      return data as Identity;
    },
    save: async (identityId: string, identity: Identity) => {
      return client.put(`/${identityId}`, identity);
    },
    community: async (communityId: string, fields?: string[]) => {
      const config: AxiosRequestConfig = {
        params: { communityId: communityId, fields: fields },
      };
      const { data } = await client.get("/pub/communities", config);
      return data[0] as Community;
    },
    communities: async (query?: CommunityQuery, fields?: string[]) => {
      const config: AxiosRequestConfig = {
        params: { ...query, fields: fields },
      };
      const { data } = await client.get("/pub/communities", config);
      return data as Community[];
    },
  };
};

/**
 * CommunityQuery
 */
export interface CommunityQuery {
  code?: string;
  limit?: number;
  page?: number;
}

/**
 * The identity service.
 */
export interface IdentityService {
  /**
   * Resolve an identity
   * @returns Promise<Identity>
   */
  resolve: (fields?: string[]) => Promise<Identity>;

  /**
   * Save an identity
   * @returns Promise<void>
   */
  save: (identityId: string, identity: Identity) => Promise<void>;

  /**
   * Get a community by id
   * @returns Promise<Community>
   */
  community: (communityId: string, fields?: string[]) => Promise<Community>;

  /**
   * Search communities
   * @returns Promise<Community[]>
   */
  communities: (
    query?: CommunityQuery,
    fields?: string[]
  ) => Promise<Community[]>;
}
