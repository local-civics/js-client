import { AxiosInstance } from "axios";

/**
 * The action.
 */
export type Action = {
  actionId?: string;
  actionName?: string;
  communityId?: string;
  residentId?: string;
  peerId?: string;
  experienceId?: string;
  experienceName?: string;
  projectId?: string;
  badgeId?: string;
  taskId?: string;
  version?: string;
  ip?: string;
  userAgent?: string;
  tags?: string[];
  skills?: string[];
  pathway?:
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation";
  milestone?: boolean;
  quality?: number;
  observedAt?: string;
};

/**
 * The action query.
 */
export type ActionQuery = {
  [key: string]: string | number | string[] | undefined;
  actionName?: string;
  experienceId?: string;
  experienceName?: string;
  badgeId?: string;
  taskId?: string;
  day?: string;
  period?: "month" | "day" | "week";
  limit?: number;
  page?: number;
  fields?: string[];
};

/**
 * The action service
 * @param client
 * @param version
 */
export const actionService = (client: AxiosInstance, version: number) => {
  return {
    list: async (residentName: string, query?: ActionQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/discovery/v${version}/residents/${residentName}/actions`,
        params: query,
      });
      return data as Action[];
    },
  };
};
