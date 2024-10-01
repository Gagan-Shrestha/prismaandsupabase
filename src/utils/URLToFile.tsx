/** @format */

export async function imageUrlToFile(url: string, p0?: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = url.substring(url.lastIndexOf("/") + 1);
  return new File([blob], filename);
}
