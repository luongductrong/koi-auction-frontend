const baseUrl = import.meta.env.BASE_URL;

export function getMockApi(url) {
  if (url.startsWith('/auction/filter') && url.includes('size=4')) {
    return `${baseUrl}auctions-home.json`;
  }
  if (url.startsWith('/breeder/user')) {
    return `${baseUrl}breeder-home.json`;
  }

  return null;
}