import { AxiosRequestConfig } from "axios";

/**
 * The experience.
 */
export type Experience = {
  experienceId?: string;
  experienceName?: string;
  communityId?: string;
  displayName?: string;
  summary?: string;
  address?: string;
  imageURL?: string;
  externalURL?: string;
  registrationURL?: string;
  notBefore?: string;
  notAfter?: string;
  format?: "online" | "in-person";
  latitude?: number;
  longitude?: number;
  milestone?: boolean;
  tags?: string[];
  skills?: string[];
  pathway?:
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation";
  quality?: number;
  presentation?: Slide[];
  priority?: number;
  distance?: number;
  createdAt?: string;
  updatedAt?: string;
};

/** Embedded presentation. */
export type Slide = {
  title?: string;
  embedURL?: string;
  asynchronous?: boolean;
  response?: {
    required?: boolean;
    upload?: boolean;
    minimumLength?: number;
    choices?: any[];
  }
}

/**
 * The experience query.
 */
export type ExperienceQuery = {
  experienceName?: string | null;
  displayName?: string | null;
  day?: string | null;
  tags?: string[] | null;
  skills?: string[] | null;
  milestone?: boolean | null;
  presentation?: boolean | null;
  pathways?: (
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation"
  )[] | null;
  latitude?: number | null;
  longitude?: number | null;
  orderBy?: "top" | "soonest" | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
};

/**
 * The experience service.
 * @param client
 * @param version
 */
export const experienceService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    view: async (
      communityName: string,
      experienceName: string,
      query?: ExperienceQuery
    ) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/experiences/${experienceName}`,
        params: query,
      });
      return data as Experience;
    },
    list: async (communityName: string, query?: ExperienceQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/experiences`,
        params: query,
      });
      return data as Experience[];
    },
  };
};
