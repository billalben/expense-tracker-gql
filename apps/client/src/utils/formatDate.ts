/**
 * Format a timestamp to a human-readable date string.
 * @example
 * formatDate("1630360800000") => "30 Aug 2021"
 */

// const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric"};

export const formatDate = (timestamp: string) => {
  const date = new Date(Number(timestamp));

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
