import { AxiosInstance } from "axios";

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
export const residentService = (client: AxiosInstance, version: number) => {
  return {
    view: async (residentName: string, query?: ResidentQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/identity/v${version}/residents/${residentName}`,
        params: query,
      });
      return data as Resident;
    },
    resolve: async (query?: ResidentQuery) => {
      const { data } = await client.request({
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
      if (resident.interests !== undefined) {
        delete resident.interests;
        await client.request({
          method: "PUT",
          url: `/identity/v${version}/residents/${residentName}/interests`,
          data: {
            impactStatement: resident.interests,
          },
        });
      }

      if (resident.impactStatement !== undefined) {
        delete resident.impactStatement;
        await client.request({
          method: "PUT",
          url: `/identity/v${version}/residents/${residentName}/impact-statement`,
          data: {
            impactStatement: resident.impactStatement,
          },
        });
      }

      if (resident.avatarFile !== undefined) {
        delete resident.avatarFile;
        await client.request({
          method: "PUT",
          url: `/identity/v${version}/residents/${residentName}/avatar`,
          headers: { "Content-Type": "multipart/form-data" },
          data: {
            avatar: resident.avatarFile,
          },
        });
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
