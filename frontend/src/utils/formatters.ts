export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const differenceMs = Date.now() - date.getTime();
  if (Number.isNaN(differenceMs)) {
    return "Recently";
  }

  const minutes = Math.round(differenceMs / 60_000);
  if (Math.abs(minutes) < 1) {
    return "Just now";
  }
  if (Math.abs(minutes) < 60) {
    return `${Math.abs(minutes)}m ago`;
  }

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return `${Math.abs(hours)}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${Math.abs(days)}d ago`;
}
