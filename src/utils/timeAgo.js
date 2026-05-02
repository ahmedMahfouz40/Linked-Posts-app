function timeAgoShort(dateString) {
  const now = new Date();
  const past = new Date(dateString);

  const diffInSeconds = Math.floor((now - past) / 1000);

  const units = [
    { label: "y", seconds: 60 * 60 * 24 * 365 },
    { label: "mo", seconds: 60 * 60 * 24 * 30 },
    { label: "d", seconds: 60 * 60 * 24 },
    { label: "h", seconds: 60 * 60 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value >= 1) {
      return `${value}${unit.label}`;
    }
  }

  return "now";
}


export default timeAgoShort;