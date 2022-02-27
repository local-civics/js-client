import { AxiosRequestConfig } from "axios";

/**
 * The experience.
 */
export type Experience = {
  experienceId?: string | null;
  experienceName?: string | null;
  communityId?: string | null;
  displayName?: string | null;
  summary?: string | null;
  address?: string | null;
  imageURL?: string | null;
  externalURL?: string | null;
  registrationURL?: string | null;
  notBefore?: string | null;
  notAfter?: string | null;
  format?: "online" | "in-person" | null;
  latitude?: number | null;
  longitude?: number | null;
  milestone?: boolean | null;
  tags?: string[] | null;
  skills?: string[] | null;
  pathway?:
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation" | null;
  quality?: number | null;
  priority?: number | null;
  distance?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

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
