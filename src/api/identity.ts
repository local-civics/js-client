import { AxiosRequestConfig } from "axios";

export type TenantPreview = {
  id?: string;
  nickname?: string;
  teams?: TeamSearchView[];
  organizations?: OrganizationSearchView[];
  email?: string;
  givenName?: string;
  familyName?: string;
  grade?: number;
  subject?: string;
  role?: string;
  statement?: string;
  interests?: string[];
  avatarURL?: string;
  createdAt?: string;
};

export type OrganizationSearchView = {
  id?: string;
  leaderId?: string;
  name?: string;
  nickname?: string;
  location?: string;
};

export type TeamSearchView = {
  id?: string;
  leaderId?: string;
  name?: string;
  nickname?: string;
};

export const identityService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    digest: async () => {
      const data = await client.request({
        method: "GET",
        url: `/identity/v${version}/digest`,
      });
      return data as TenantPreview;
    },
    viewTenant: async (tenantName: string) => {
      const data = await client.request({
        method: "GET",
        url: `/identity/v${version}/tenants/${tenantName}`,
      });
      return data as TenantPreview;
    },
    configureTenant: async (
      tenantName: string,
      changes: {
        newNickname?: string;
        newGivenName?: string;
        newFamilyName?: string;
        newGrade?: number;
        newSubject?: string;
        newRole?: string;
        newImpactStatement?: string;
        newInterests?: string;
        newAvatar?: Blob;
      }
    ) => {
      changes = { ...changes };
      if (changes.newAvatar !== undefined) {
        const data = new FormData();
        data.append("avatar", changes.newAvatar);
        await client.request({
          method: "PATCH",
          url: `/identity/v${version}/tenants/${tenantName}`,
          data: data,
        });

        delete changes.newAvatar;
      }

      if (Object.keys(changes).length > 0) {
        await client.request({
          method: "PATCH",
          url: `/identity/v${version}/tenants/${tenantName}`,
          data: changes,
        });
      }
    },
    searchOrganizations: async (query: { name?: string }) => {
      const data = await client.request({
        method: "GET",
        url: `/identity/v${version}/organizations`,
        params: query,
      });
      return data as OrganizationSearchView[];
    },
    joinOrganization: async (
      tenantName: string,
      organizationName: string,
      code: string
    ) => {
      return client.request({
        method: "POST",
        url: `/identity/v${version}/tenants/${tenantName}/organizations/${organizationName}/join`,
        data: { code },
      });
    },
  };
};
