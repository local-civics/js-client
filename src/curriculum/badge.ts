import { AxiosRequestConfig } from "axios";
import { Project } from "./project";

/**
 * The badge.
 */
export type Badge = {
  badgeId?: string | null;
  badgeName?: string | null;
  communityId?: string | null;
  displayName?: string | null;
  summary?: string | null;
  imageURL?: string | null;
  prerequisite?: string | null;
  pathway?:
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation" | null;
  projects?: Project[] | null;
  status?: "in-progress" | "todo" | "done" | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

/**
 * The badge query.
 */
export type BadgeQuery = {
  residentName?: string | null;
  badgeName?: string | null;
  displayName?: string | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
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
