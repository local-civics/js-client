import { AxiosRequestConfig } from "axios";
import { Project } from "./project";

/**
 * The badge.
 */
export type Badge = {
  badgeId?: string;
  badgeName?: string;
  communityId?: string;
  displayName?: string;
  summary?: string;
  imageURL?: string;
  prerequisite?: string;
  pathway?:
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation";
  projects?: Project[];
  status?: "in-progress" | "todo" | "done";
  createdAt?: string;
  updatedAt?: string;
};

/**
 * The badge query.
 */
export type BadgeQuery = {
  residentName?: string;
  badgeName?: string;
  displayName?: string;
  limit?: number;
  page?: number;
  fields?: string[];
};

/**
 * The badge service.
 * @param client
 * @param version
 */
export const badgeService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    view: async (
      communityName: string,
      badgeName: string,
      query?: BadgeQuery
    ) => {
      const data: Badge = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/badges/${badgeName}`,
        params: query,
      });
      return data;
    },
    start: async (residentName: string, badgeName: string) => {
      return client.request({
        method: "PUT",
        url: `/curriculum/v${version}/residents/${residentName}/badges/${badgeName}`,
      });
    },
    list: async (communityName: string, query?: BadgeQuery) => {
      const data: Badge[] = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/badges`,
        params: query,
      });
      return data;
    },
  };
};
