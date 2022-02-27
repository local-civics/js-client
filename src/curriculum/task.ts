import { AxiosRequestConfig } from "axios";

/**
 * The task.
 */
export type Task = {
  taskId?: string | null;
  taskName?: string | null;
  badgeName?: string | null;
  experienceName?: string | null;
  experienceNamePrefix?: string | null;
  actionName?: string | null;
  displayName?: string | null;
  summary?: string | null;
  communityId?: string | null;
  residentId?: string | null;
  quantity?: string | null;
  quality?: string | null;
  status?: "todo" | "in-progress" | "done" | null;
  notBefore?: string | null;
  notAfter?: string | null;
  completedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

/**
 * The task query.
 */
export type TaskQuery = {
  taskName?: string | null;
  displayName?: string | null;
  badgeName?: string | null;
  experienceName?: string | null;
  actionName?: string | null;
  status?: "todo" | "in-progress" | "review" | "done" | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
};

/**
 * The task service
 * @param client
 * @param version
 */
export const taskService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    view: async (residentName: string, taskName: string, query?: TaskQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        params: query,
      });
      return data as Task;
    },
    start: async (residentName: string, taskName: string) => {
      return client.request({
        method: "PATCH",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        data: { status: "in-progress" },
      });
    },
    stop: async (residentName: string, taskName: string) => {
      return client.request({
        method: "PATCH",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        data: { status: "todo" },
      });
    },
    done: async (residentName: string, taskName: string) => {
      return client.request({
        method: "PATCH",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        data: { status: "done" },
      });
    },
    list: async (residentName: string, query?: TaskQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/tasks`,
        params: query,
      });
      return data as Task[];
    },
  };
};
