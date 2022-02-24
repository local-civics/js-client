import { AxiosRequestConfig } from "axios";

/**
 * The report.
 */
export type Report = {
  communityId?: string;
  residentId?: string;
  experienceId?: string;
  projectId?: string;
  badgeId?: string;
  degree?: number;
  quality?: number;
  nextPromotion?: number;
  badges?: number;
  milestones?: number;
  reflections?: number;
  registrations?: number;
  pathway?:
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation";
  pathways?: (
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation"
  )[];
  skills?: string[];
  tags?: string[];
  tasks?: number;
  activity?: number;
};

/**
 * The report query.
 */
export type ReportQuery = {
  [key: string]: string | number | string[] | undefined;
  pathways?: (
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation"
  )[];
  actionName?: string;
  experienceId?: string;
  badgeId?: string;
  taskId?: string;
  projectId?: string;
  day?: string;
  period?: "month" | "day" | "week";
  groupBy?:
    | "resident"
    | "community"
    | "badge"
    | "project"
    | "task"
    | "experience"
    | "pathway";
  limit?: number;
  page?: number;
  fields?: string[];
};

/**
 * The report service
 * @param client
 * @param version
 */
export const reportService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    list: async (residentName: string, query?: ReportQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/discovery/v${version}/residents/${residentName}/reports`,
        params: query,
      });
      return data as Report[];
    },
  };
};
