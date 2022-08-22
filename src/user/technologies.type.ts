export const Technologies = [
  'NestJS',
  'Vite',
  'MongoDB',
  'Swagger',
  'SWC',
] as const;

export type Technology = typeof Technologies[number];
