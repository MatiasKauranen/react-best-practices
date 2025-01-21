import { useState, useEffect } from "react";

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        padding: "1rem",
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderRadius: "2rem",
          backgroundColor: "#1a1a1a",
        }}
      >
        <div>{time.toLocaleDateString()}</div>
        <div>
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default Clock;
