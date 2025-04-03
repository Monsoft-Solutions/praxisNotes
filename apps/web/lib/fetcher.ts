/**
 * Custom fetcher for SWR to handle API requests
 * @param url The URL to fetch data from
 * @returns The parsed JSON response
 */
export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return response.json();
};
