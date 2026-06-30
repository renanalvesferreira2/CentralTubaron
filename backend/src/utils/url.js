export function getHost(value) {
  return value ? new URL(value).hostname : undefined;
}

export function buildIntegrationUrl(baseUrl, pathname, query = {}) {
  const url = new URL(pathname, `${baseUrl}/`);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}
