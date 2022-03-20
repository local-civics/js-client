import { AxiosRequestConfig } from "axios";

export type WorkspaceView = {
  awards?: BadgePreview[];
  objectives?: BadgePreview[];
  incentives?: BadgePreview[];
  todo?: TaskView[];
  inProgress?: TaskView[];
  done?: TaskView[];
  impact?: ImpactView;
};

export type BadgePreview = {
  id?: number;
  marketId?: string;
  headline?: string;
  summary?: string;
  level?: number;
  imageURL?: string;
};

export type TaskView = {
  id?: number
  title?: string;
  marketId?: string;
  badgeId?: number;
  level?: number;
  frequency?: number;
  activityPrefix?: string;
  activityId?: number;
};

export type ImpactView = {
  xp?: number;
  nextXP?: number;
  level?: number;
  reflections?: number;
  milestones?: number;
  career?: PathwayView;
  policy?: PathwayView;
  culture?: PathwayView;
  volunteer?: PathwayView;
  recreation?: PathwayView;
};

export type PathwayView = {
  xp?: number;
  nextXP?: number;
  level?: number;
  reflections?: number;
  milestones?: number;
};

export type WorkspaceActivitiesView = {
  top?: ActivityPreview[];
  upcoming?: ActivityPreview[];
  milestones?: ActivityPreview[];
  suggested?: ActivityPreview[];
};

export type ActivityPreview = {
  id?: number;
  marketId?: string;
  headline?: string;
  imageURL?: string;
  rsvp?: boolean;
  pathway?: string;
};

export type WorkspaceCalendarView = {
  events?: ActivityPreview[];
};

export type ActivityView = {
  headline?: string;
  summary?: string;
  skills?: string[];
  rsvp?: boolean;
  imageURL?: string;
  pathway?: string;
  link?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  startTime?: string;
  minutes?: number;
  priority?: number;
  reaction?: ReactionView;
};

export type ReactionView = {
  notify?: boolean;
  rating?: number;
  reflection?: string;
};

export type BadgeView = {
  headline?: string;
  summary?: string;
  imageURL?: string;
  requirements?: string;
  todo?: TaskView[];
  inProgress?: TaskView[];
  done?: TaskView[];
};

export const curriculumService = (
  client: { request: (conf: AxiosRequestConfig) => Promise<any> },
  version: number
) => {
  return {
    changeReaction: async (
      workspaceName: string,
      marketName: string,
      activityId: number,
      changes?: {
        questionId?: number;
        focusGroupId?: number;
        openEndedResponse?: string;
        multipleChoiceAnswers?: string[];
        toggleNotifications?: boolean;
        givenName?: string;
        email?: string;
        origin?: string;
        reflection?: string;
        rating?: number;
      }
    ) => {
      changes = { ...changes };
      if (Object.keys(changes).length > 0) {
        await client.request({
          method: "PATCH",
          url: `/curriculum/v${version}/workspaces/tenant:${workspaceName}/reactions/${marketName}:${activityId}`,
          data: changes,
        });
      }
    },
    startBadge: async (
      workspaceName: string,
      marketName: string,
      badgeId: number,
      level: number
    ) => {
      return client.request({
        method: "PUT",
        url: `/curriculum/v${version}/workspaces/tenant:${workspaceName}/badges/${marketName}:${badgeId}.${level}`,
      });
    },
    viewWorkspace: async (workspaceName: string) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/workspaces/tenant:${workspaceName}`,
      });
      return data as WorkspaceView;
    },
    viewWorkspaceActivities: async (
      workspaceName: string,
      query?: { pathways?: string[]; skills?: string[]; tags?: string[] }
    ) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/workspaces/tenant:${workspaceName}/activities`,
        params: query,
      });
      return data as WorkspaceActivitiesView;
    },
    viewWorkspaceCalendar: async (workspaceName: string, day: string) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/workspaces/tenant:${workspaceName}/calendar/day:${day}`,
      });
      return data as WorkspaceCalendarView;
    },
    viewWorkspaceActivity: async (
      workspaceName: string,
      marketName: string,
      activityId: number
    ) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/workspaces/tenant:${workspaceName}/activities/${marketName}:${activityId}`,
      });

      return data as ActivityView;
    },
    viewWorkspaceBadge: async (
      workspaceName: string,
      marketName: string,
      badgeId: number,
      level: number
    ) => {
      const data = await client.request({
        method: "GET",
        url: `/curriculum/v${version}/workspaces/tenant:${workspaceName}/badges/${marketName}:${badgeId}.${level}`,
      });

      return data as BadgeView;
    },
  };
};
