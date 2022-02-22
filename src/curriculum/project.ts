/**
 * The project.
 */
export type Project = {
  [key: string]: string | number | string[] | undefined;
  projectId?: string;
  projectName?: string;
  badgeName?: string;
  experienceName?: string;
  actionName?: string;
  displayName?: string;
  summary?: string;
  quantity?: string;
  quality?: string;
  notBefore?: string;
  notAfter?: string;
  createdAt?: string;
  updatedAt?: string;
};
