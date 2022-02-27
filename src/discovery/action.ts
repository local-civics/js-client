import { AxiosRequestConfig } from "axios";

/**
 * The action.
 */
export type Action = {
  actionId?: string | null;
  actionName?: string | null;
  communityId?: string | null;
  residentId?: string | null;
  peerId?: string | null;
  experienceId?: string | null;
  experienceName?: string | null;
  projectId?: string | null;
  badgeId?: string | null;
  taskId?: string | null;
  version?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  tags?: string[] | null;
  skills?: string[] | null;
  pathway?:
    | "policy & government"
    | "arts & culture"
    | "college & career"
    | "volunteer"
    | "recreation" | null;
  milestone?: boolean | null;
  quality?: number | null;
  observedAt?: string | null;
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
