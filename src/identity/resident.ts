import { AxiosRequestConfig } from "axios";

/**
 * The resident.
 */
export type Resident = {
  residentId?: string | null;
  openId?: string | null;
  residentName?: string | null;
  email?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  communityName?: string | null;
  role?: "educator" | "student" | "management" | null;
  subject?:
    | "social studies"
    | "english"
    | "math"
    | "science"
    | "special education"
    | "counseling | college & career readiness"
    | "non-instructional staff"
    | "school leadership" | null;
  grade?: number | null;
  tags?: string[] | null;
  interests?: string[] | null;
  impactStatement?: string | null;
  avatarURL?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastLoginAt?: string | null;
};

/**
 * The resident query.
 */
export type ResidentQuery = {
  residentName?: string | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
};

/**
 * Resident service.
 * @param client
 * @param version
 */
export const residentService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    view: async (residentName: string, query?: ResidentQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/identity/v${version}/residents/${residentName}`,
        params: query,
      });
      return data as Resident;
    },
    resolve: async (query?: ResidentQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/identity/v${version}/resolve`,
        params: query,
      });
      return data as Resident;
    },
    save: async (
      residentName: string,
      resident: Resident & { avatarFile?: Blob }
    ) => {
      resident = { ...resident };

      if (resident.interests !== undefined) {
        await client.request({
          method: "PUT",
          url: `/identity/v${version}/residents/${residentName}/interests`,
          data: {
            interests: resident.interests,
          },
        });

        delete resident.interests;
      }

      if (resident.impactStatement !== undefined) {
        await client.request({
          method: "PUT",
          url: `/identity/v${version}/residents/${residentName}/impact-statement`,
          data: {
            impactStatement: resident.impactStatement,
          },
        });

        delete resident.impactStatement;
      }

      if (resident.avatarFile !== undefined) {
        await client.request({
          method: "PUT",
          url: `/identity/v${version}/residents/${residentName}/avatar`,
          headers: { "Content-Type": "multipart/form-data" },
          data: {
            avatar: resident.avatarFile,
          },
        });

        delete resident.avatarFile;
      }

      if (Object.keys(resident).length > 0) {
        await client.request({
          method: "PATCH",
          url: `/identity/v${version}/residents/${residentName}`,
          data: resident,
        });
      }
    },
  };
};
