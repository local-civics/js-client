import { AxiosInstance } from "axios";

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
  priority?: number;
  distance?: number;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * The experience query.
 */
export type ExperienceQuery = {
  experienceName?: string;
  displayName?: string;
  day?: string;
  tags?: string[];
  milestone?: boolean;
  pathways?: (
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation"
  )[];
  latitude?: number;
  longitude?: number;
  orderBy?: "top" | "soonest";
  limit?: number;
  page?: number;
  fields?: string[];
};

/**
 * The experience service.
 * @param client
 * @param version
 */
export const experienceService = (client: AxiosInstance, version: number) => {
  return {
    view: async (
      communityName: string,
      experienceName: string,
      query?: ExperienceQuery
    ) => {
      const { data } = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/experiences/${experienceName}`,
        params: query,
      });
      return data as Experience;
    },
    list: async (communityName: string, query?: ExperienceQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/experiences`,
        params: query,
      });
      return data as Experience[];
    },
  };
};
