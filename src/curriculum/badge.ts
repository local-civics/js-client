import { AxiosInstance } from "axios";
import { Project } from "./project";

/**
 * The badge.
 */
export type Badge = {
  [key: string]: string | number | string[] | Project[] | undefined;
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
  [key: string]: string | number | string[] | undefined;
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
export const badgeService = (client: AxiosInstance, version: number) => {
  return {
    view: async (
      communityName: string,
      badgeName: string,
      query?: BadgeQuery
    ) => {
      const { data } = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/badges/${badgeName}`,
        params: query,
      });
      return data as Badge;
    },
    start: async (residentName: string, badgeName: string) => {
      return client.request({
        method: "PUT",
        url: `/curriculum/v${version}/residents/${residentName}/badges/${badgeName}`,
      });
    },
    list: async (communityName: string, query?: BadgeQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/badges`,
        params: query,
      });
      return data as Badge[];
    },
  };
};
