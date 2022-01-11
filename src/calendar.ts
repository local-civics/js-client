import * as Sentry from "@sentry/browser";
import axios, { AxiosRequestConfig } from "axios";

/**
 * Event
 */
export interface Event {
  eventId: string;
  calendarId: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  image: string;
  thumbnail: string;
  url: string;
  registrationURL: string;
  notBefore: string;
  notAfter: string;
  latitude: string;
  longitude: string;
  tags: string[];
  points: number;
  status: string;
  watchers: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Reflection
 */
export interface Reflection {
  eventId?: string;
  calendarId?: string;
  entry: string;
  rank: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Watcher
 */
export interface Watcher {
  eventId?: string;
  calendarId?: string;
  addressee: string;
  email: string;
  createdAt?: string;
}

/**
 * EventQuery
 */
export interface EventQuery {
  name?: string;
  period?: "day" | "week" | "month";
  day?: string;
  milestone?: boolean;
  tags?: string[];
  status?: "review" | "approved" | "canceled" | "watched" | "reflection";
  space?: string;
  limit?: number;
  page?: number;
}

/**
 * Create a calendar service instance
 * @param config
 */
export const calendar: (config?: AxiosRequestConfig) => CalendarService = (
  config?: AxiosRequestConfig
) => {
  const client = axios.create({
    ...config,
    baseURL: `${config?.baseURL || ""}/calendar/v0`,
  });
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      Sentry.captureException(error);
      return Promise.reject(error);
    }
  );
  return {
    events: async (
      calendarId: string,
      query?: EventQuery,
      fields?: string[]
    ) => {
      const config: AxiosRequestConfig = {
        params: { ...query, fields: fields },
      };
      const { data } = await client.get(`/${calendarId}/events`, config);
      return data as Event[];
    },

    watch: async (calendarId: string, eventId: string, watcher: Watcher) => {
      return client.post(`/${calendarId}`, { ...watcher, eventId });
    },

    unwatch: async (calendarId: string, eventId: string) => {
      return client.delete(`/${calendarId}/events/${eventId}`);
    },

    reflection: async (
      calendarId: string,
      eventId: string,
      fields?: string[]
    ) => {
      const config: AxiosRequestConfig = {
        params: { eventId: eventId, fields: fields },
        validateStatus(status: number) {
          return status === 200;
        },
      };
      const { data } = await client.get(`/${calendarId}/reflections`, config);
      return data[0] as Reflection;
    },

    deliberate: async (
      calendarId: string,
      eventId: string,
      reflection: Reflection
    ) => {
      reflection.calendarId = calendarId;
      return client.post(`/${calendarId}/reflections`, reflection);
    },

    reconsider: async (
      calendarId: string,
      eventId: string,
      reflection: Reflection
    ) => {
      reflection.calendarId = calendarId;
      reflection.eventId = eventId;
      return client.put(
        `/${calendarId}/events/${eventId}/reflection`,
        reflection
      );
    },
  };
};

/**
 * The calendar service.
 */
export interface CalendarService {
  /**
   * Search events
   * @returns Promise<Event[]>
   */
  events: (
    calendarId: string,
    query?: EventQuery,
    fields?: string[]
  ) => Promise<Event[]>;

  /**
   * Watch event
   * @param calendarId
   * @param eventId
   */
  watch: (
    calendarId: string,
    eventId: string,
    watcher: Watcher
  ) => Promise<void>;

  /**
   * Unwatch event
   * @param calendarId
   * @param eventId
   */
  unwatch: (calendarId: string, eventId: string) => Promise<void>;

  /**
   * Get reflection
   * @param calendarId
   * @param eventId
   */
  reflection: (
    calendarId: string,
    eventId: string,
    fields?: string[]
  ) => Promise<Reflection>;

  /**
   * Insert reflection
   * @param calendarId
   * @param eventId
   * @param reflection
   */
  deliberate: (
    calendarId: string,
    eventId: string,
    reflection: Reflection
  ) => Promise<void>;

  /**
   * Update reflection
   * @param calendarId
   * @param eventId
   * @param reflection
   */
  reconsider: (
    calendarId: string,
    eventId: string,
    reflection: Reflection
  ) => Promise<void>;
}
