import { AxiosInstance } from "axios";

/**
 * The registration.
 */
export type Registration = {
  communityId?: string;
  residentId?: string;
  experienceName?: string;
  email?: string;
  givenName?: string;
  originURL?: string;
  notAfter?: string;
  createdAt?: string;
};

/**
 * The registration query.
 */
export type RegistrationQuery = {
  experienceName?: string;
  limit?: number;
  page?: number;
  fields?: string[];
};

/**
 * The registration service.
 * @param client
 * @param version
 */
export const registrationService = (client: AxiosInstance, version: number) => {
  return {
    view: async (
      residentName: string,
      experienceName: string,
      query?: RegistrationQuery
    ) => {
      const { data } = await client.request({
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
      const { data } = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/residents/${residentName}/registrations`,
        params: query,
      });
      return data as Registration[];
    },
  };
};
