type ApiParams = Record<string, string | boolean | number | null | undefined>;

interface ApiResponse {
  data?: unknown;
  [key: string]: unknown;
}

// Helper function to log request and response
export const logRequestResponse = (method: string, action: string, params: ApiParams, response: ApiResponse | unknown) => {
  console.log(`[${method}] ${action}`);
  console.log('Parameters:', params);
  console.log('Response:', response);
};