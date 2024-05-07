export const allFunctionRoutes = [
  'client',
  'login',
  'user',
  'setupTestData',
  'teardownTestData',
] as const;

export type FunctionRoutes = (typeof allFunctionRoutes)[number];
