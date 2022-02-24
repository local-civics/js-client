import { AxiosRequestConfig } from "axios";

/**
 * The resident.
 */
export type Resident = {
  residentId?: string;
  openId?: string;
  residentName?: string;
  email?: string;
  givenName?: string;
  familyName?: string;
  communityName?: string;
  role?: "educator" | "student" | "management";
  subject?:
    | "social studies"
    | "english"
    | "math"
    | "science"
    | "special education"
    | "counseling | college & career readiness"
    | "non-instructional staff"
    | "school leadership";
  grade?: number;
  tags?: string[];
  interests?: string[];
  impactStatement?: string;
  avatarURL?: string;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  online?: boolean;
};

/**
 * The resident query.
 */
export type ResidentQuery = {
  residentName?: string;
  limit?: number;
  page?: number;
  fields?: string[];
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
