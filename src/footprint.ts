import * as Sentry from "@sentry/browser";
import axios, { AxiosRequestConfig } from "axios";

/**
 * Badge
 */
export interface Badge {
  badgeId?: string;
  name?: string;
  description?: string;
  criteria?: Criterion[];
  networkId?: string;
  imageURL?: string;
  icon?: string;
  division?: string;
  notBefore?: string;
  notAfter?: string;
  weight?: number;
  progress?: BadgeProgress;
  createdAt?: string;
}

/**
 * Criterion
 */
export interface Criterion {
  name?: string;
  tag?: string;
  weight?: number;
  frequency?: number;
}

/**
 * BadgeProgress
 */
export interface BadgeProgress {
  actorId?: string;
  badgeId?: string;
  criteria?: CriterionProgress[];
  completedAt?: string;
}

/**
 * CriterionProgress
 */
export interface CriterionProgress {
  name?: string;
  tag?: string;
  weight?: number;
  frequency?: number;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}

/**
 * Pathway
 */
export interface Pathway {
  pathwayId?: string;
  networkId?: string;
  division?: string;
  icon?: string;
  name?: string;
  description?: string;
  journey?: Waypoint[];
  tags?: string[];
  weight?: number;
  progress?: PathwayProgress;
  createdAt?: string;
}

/**
 * Waypoint
 */
export interface Waypoint {
  name?: string;
  weight?: number;
  milestone?: boolean;
  icon?: string;
  tags?: string[];
  createdAt?: string;
}

/**
 * PathwayProgress
 */
export interface PathwayProgress {
  actorId?: string;
  pathwayId?: string;
  journey?: WaypointProgress[];
  completedAt?: string;
}

/**
 * WaypointProgress
 */
export interface WaypointProgress {
  completedAt?: string;
}

/**
 * Passport
 */
export interface Passport {
  actorId?: string;
  stage?: number;
  xp?: number;
  nextXP?: number;
  badges?: number;
  pathways?: number;
  reflections?: number;
  milestones?: number;
  network?: string[];
  createdAt?: string;
}

/**
 * Create a footprint service instance
 * @param config
 */
export const footprint: (config?: AxiosRequestConfig) => FootprintService = (
  config?: AxiosRequestConfig
) => {
  const client = axios.create({
    ...config,
    baseURL: `${config?.baseURL || ""}/footprint/v0`,
  });
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    }
  );
  return {
    badges: async (actorId: string, query?: BadgeQuery, fields?: string[]) => {
      const config: AxiosRequestConfig = {
        params: { ...query, fields: fields },
      };
      const { data } = await client.get(`/${actorId}/badges`, config);
      return data as Badge[];
    },
    pathways: async (
      actorId: string,
      query?: PathwayQuery,
      fields?: string[]
    ) => {
      const config: AxiosRequestConfig = {
        params: { ...query, fields: fields },
      };
      const { data } = await client.get(`/${actorId}/pathways`, config);
      return data as Pathway[];
    },
    passport: async (actorId: string, fields?: string[]) => {
      const config: AxiosRequestConfig = { params: { fields: fields } };
      const { data } = await client.get(`/${actorId}/passport`, config);
      return data as Passport;
    },
  };
};

/**
 * BadgeQuery
 */
export interface BadgeQuery {
  limit?: number;
  page?: number;
}

/**
 * PathwayQuery
 */
export interface PathwayQuery {
  limit?: number;
  page?: number;
}

/**
 * The footprint service.
 */
export interface FootprintService {
  /**
   * Search badges
   * @returns Promise<Badge[]>
   */
  badges: (
    actorId: string,
    query?: BadgeQuery,
    fields?: string[]
  ) => Promise<Badge[]>;

  /**
   * Search pathways
   * @returns Promise<Pathway[]>
   */
  pathways: (
    actorId: string,
    query?: PathwayQuery,
    fields?: string[]
  ) => Promise<Pathway[]>;

  /**
   * Get a passport by id
   * @returns Promise<Passport>
   */
  passport: (actorId: string, fields?: string[]) => Promise<Passport>;
}
