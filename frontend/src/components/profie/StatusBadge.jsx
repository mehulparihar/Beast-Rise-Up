import React from "react";

export default function StatusBadge({ status }) {
  const styles = {
    Delivered: "bg-green-100 text-green-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Processing: "bg-amber-100 text-amber-700",
    Cancelled: "bg-red-100 text-red-700",
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  )
}

