export function getHost(value) {
  return value ? new URL(value).hostname : undefined;
}
