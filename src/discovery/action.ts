import { AxiosRequestConfig } from "axios";

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
  actionName?: string | null;
  experienceId?: string | null;
  experienceName?: string | null;
  badgeId?: string | null;
  taskId?: string | null;
  day?: string | null;
  period?: "month" | "day" | "week" | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
};

/**
 * The action service
 * @param client
 * @param version
 */
export const actionService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    list: async (residentName: string, query?: ActionQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/discovery/v${version}/residents/${residentName}/actions`,
        params: query,
      });
      return data as Action[];
    },
  };
};
