const apiBaseUrl = process.env.REACT_APP_API_URL || "";

export function apiPath(path) {
  return `${apiBaseUrl}${path}`;
}
