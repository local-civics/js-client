import { AxiosRequestConfig } from "axios";

/**
 * The community.
 */
export type Community = {
  communityId?: string | null;
  communityName?: string | null;
  displayName?: string | null;
  country?: string | null;
  state?: string | null;
  postalCodes?: string[] | null;
  area?: CommunityArea | null;
  placeName?: string | null;
  avatarURL?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

/**
 * Community area
 */
export type CommunityArea = {
  latitude?: number | null;
  longitude?: number | null;
  radius?: number | null;
};

/**
 * The community query.
 */
export type CommunityQuery = {
  displayName?: string | null;
  communityName?: string | null;
  limit?: number | null;
  page?: number | null;
  fields?: string[] | null;
};

/**
 * Community service.
 * @param client
 * @param version
 */
export const communityService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    view: async (communityName: string, query?: CommunityQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/identity/v${version}/communities/${communityName}`,
        params: query,
      });
      return data as Community;
    },
    list: async (query?: CommunityQuery) => {
      const data = await client.request({
        method: "GET",
        url: `/identity/v${version}/communities`,
        params: query,
      });
      return data as Community[];
    },
    join: async (communityName: string, residentName: string, accessCode: string) => {
      return client.request({
        method: "POST",
        url: `/identity/v${version}/communities/${communityName}/residents`,
        data: { accessCode: accessCode, residentName: residentName, },
      });
    },
  };
};
