/**
 * Format a timestamp to a human-readable date string.
 * @example
 * formatDate(1704067200000); // "12 Dec 2023"
 */

// const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric"};

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

console.log(formatDate(1704067200000)); // "12 Dec 2023"
