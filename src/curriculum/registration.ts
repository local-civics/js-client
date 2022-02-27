import { AxiosRequestConfig } from "axios";

/**
 * The registration.
 */
export type Registration = {
  communityId?: string | null;
  residentId?: string | null;
  experienceName?: string | null;
  email?: string | null;
  givenName?: string | null;
  originURL?: string | null;
  notAfter?: string | null;
  createdAt?: string | null;
};

/**
 * The registration query.
 */
export type RegistrationQuery = {
  experienceName?: string | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
};

/**
 * The registration service.
 * @param client
 * @param version
 */
export const registrationService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    view: async (
      residentName: string,
      experienceName: string,
      query?: RegistrationQuery
    ) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/registrations/${experienceName}`,
        params: query,
      });
      return data as Registration;
    },
    create: async (residentName: string, registration: Registration) => {
      return client.request({
        method: "POST",
        url: `/curriculum/v${version}/residents/${residentName}/registrations`,
        data: registration,
      });
    },
    remove: async (residentName: string, experienceName: string) => {
      return client.request({
        method: "DELETE",
        url: `/curriculum/v${version}/residents/${residentName}/registrations/${experienceName}`,
      });
    },
    list: async (residentName: string, query?: RegistrationQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/registrations`,
        params: query,
      });
      return data as Registration[];
    },
  };
};
