export const truncate = (url: string) => {
  const maxLength = 35;
  if (url.length > maxLength) {
    return `${url.slice(0, maxLength)}...`;
  }
  return url;
};
