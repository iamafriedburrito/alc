import React from "react";

/**
 * Props:
 * - lastPaymentDate: string (ISO date or parsable by Date)
 * - status: string ("PARTIAL", "PENDING", etc.)
 */
const FeeNotification = ({ lastPaymentDate, status }) => {
  if (!lastPaymentDate || !["PARTIAL", "PENDING"].includes(status)) return null;

  const lastDate = new Date(lastPaymentDate);
  const now = new Date();
  const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
  const showAlert = daysDiff > 30;

  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div>
        <strong>Last Payment Date:</strong>{" "}
        {lastDate.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
      </div>
      {showAlert && (
        <div style={{ color: "#b91c1c", fontWeight: "bold" }}>
          ⚠️ No payment in over 30 days!
        </div>
      )}
    </div>
  );
};

export default FeeNotification;