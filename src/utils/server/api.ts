export function getBasicAuthenticationHeader(): string {
  const { CLIENT_ID, CLIENT_SECRET } = process.env;

  return `Basic ${Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString(
    'base64',
  )}`;
}
