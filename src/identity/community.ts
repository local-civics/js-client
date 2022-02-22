import { AxiosInstance } from "axios";

/**
 * The community.
 */
export type Community = {
  communityId?: string;
  communityName?: string;
  displayName?: string;
  country?: string;
  state?: string;
  postalCodes?: string[];
  area?: CommunityArea;
  placeName?: string;
  avatarURL?: string;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Community area
 */
export type CommunityArea = {
  latitude?: number;
  longitude?: number;
  radius?: number;
};

/**
 * The community query.
 */
export type CommunityQuery = {
  displayName?: string;
  communityName?: string;
  limit?: number;
  page?: number;
  fields?: string[];
};

/**
 * Community service.
 * @param client
 * @param version
 */
export const communityService = (client: AxiosInstance, version: number) => {
  return {
    view: async (communityName: string, query?: CommunityQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/identity/v${version}/communities/${communityName}`,
        params: query,
      });
      return data as Community;
    },
    list: async (query?: CommunityQuery) => {
      const { data } = await client.request({
        method: "GET",
        url: `/identity/v${version}/communities`,
        params: query,
      });
      return data as Community[];
    },
    join: async (communityName: string, accessCode: string) => {
      return client.request({
        method: "POST",
        url: `/identity/v${version}/communities/${communityName}/residents`,
        data: { accessCode: accessCode },
      });
    },
  };
};
