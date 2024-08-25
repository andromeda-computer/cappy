import { useEffect, useState } from "hono/jsx";

const TimeAgo = ({ timestamp }: { timestamp: number }) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [showFullDate, setShowFullDate] = useState(false);

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = now - timestamp;

      let value;
      let unit;

      if (diff < 60) {
        value = diff;
        unit = "s";
      } else if (diff < 3600) {
        value = Math.floor(diff / 60);
        unit = "m";
      } else if (diff < 86400) {
        value = Math.floor(diff / 3600);
        unit = "h";
      } else if (diff < 31536000) {
        value = Math.floor(diff / 86400);
        unit = "d";
      } else {
        value = Math.floor(diff / 31536000);
        unit = "yr";
      }

      setTimeAgo(`${value}${unit}`);
    };

    updateTimeAgo();
    const timer = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [timestamp]);

  const toggleFullDate = () => {
    setShowFullDate(!showFullDate);
  };

  const formatFullDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <span onClick={toggleFullDate} style={{ cursor: "pointer" }}>
      {showFullDate ? formatFullDate(timestamp) : timeAgo}
    </span>
  );
};

export default TimeAgo;
