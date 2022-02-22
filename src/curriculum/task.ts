import { AxiosInstance } from "axios";

/**
 * The task.
 */
export type Task = {
  [key: string]: string | number | string[] | undefined;
  taskId?: string;
  taskName?: string;
  badgeName?: string;
  experienceName?: string;
  actionName?: string;
  displayName?: string;
  summary?: string;
  communityId?: string;
  residentId?: string;
  quantity?: string;
  quality?: string;
  status?: "todo" | "in-progress" | "done";
  notBefore?: string;
  notAfter?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * The task query.
 */
export type TaskQuery = {
  [key: string]: string | number | string[] | undefined;
  taskName?: string;
  displayName?: string;
  badgeName?: string;
  experienceName?: string;
  actionName?: string;
  status?: "todo" | "in-progress" | "review" | "done";
  limit?: number;
  page?: number;
  fields?: string[];
};

/**
 * The task service
 * @param client
 * @param version
 */
export const taskService = (client: AxiosInstance, version: number) => {
  return {
    view: async (residentName: string, taskName: string, query?: TaskQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        params: query,
      });
      return data as Task;
    },
    start: async (residentName: string, taskName: string) => {
      return client.request({
        method: "PUT",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        data: { status: "in-progress" },
      });
    },
    stop: async (residentName: string, taskName: string) => {
      return client.request({
        method: "PUT",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        data: { status: "todo" },
      });
    },
    done: async (residentName: string, taskName: string) => {
      return client.request({
        method: "PUT",
        url: `/curriculum/v${version}/residents/${residentName}/tasks/${taskName}`,
        data: { status: "done" },
      });
    },
    list: async (residentName: string, query?: TaskQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/tasks`,
        params: query,
      });
      return data as Task[];
    },
  };
};
