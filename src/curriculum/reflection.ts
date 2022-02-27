import { AxiosRequestConfig } from "axios";

/**
 * The reflection.
 */
export type Reflection = {
  communityId?: string;
  residentId?: string;
  experienceName?: string;
  confidence?: number;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * The reflection query.
 */
export type ReflectionQuery = {
  residentName?: string | null;
  experienceName?: string | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
};

/**
 * The reflection service.
 * @param client
 * @param version
 */
export const reflectionService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    view: async (
      residentName: string,
      experienceName: string,
      query?: ReflectionQuery
    ) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/reflections/${experienceName}`,
        params: query,
      });
      return data as Reflection;
    },
    create: async (residentName: string, reflection: Reflection) => {
      return client.request({
        method: "POST",
        url: `/curriculum/v${version}/residents/${residentName}/reflections`,
        data: reflection,
      });
    },
    remove: async (residentName: string, experienceName: string) => {
      return client.request({
        method: "DELETE",
        url: `/curriculum/v${version}/residents/${residentName}/reflections/${experienceName}`,
      });
    },
    list: async (communityName: string, query?: ReflectionQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/communities/${communityName}/reflections`,
        params: query,
      });
      return data as Reflection[];
    },
  };
};
