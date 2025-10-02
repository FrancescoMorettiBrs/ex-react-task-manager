import { memo } from "react";

export function TaskRow({ task }) {
  const { title, status, createdAt } = task;

  const statusClass = status === "To do" ? "bg-danger text-white" : status === "Doing" ? "bg-warning text-dark" : status === "Done" ? "bg-success text-white" : "";

  const dateText = (() => {
    const d = new Date(createdAt);
    return isNaN(d) ? String(createdAt ?? "") : d.toLocaleDateString();
  })();

  return (
    <tr>
      <td>{title}</td>
      <td className={statusClass}>{status}</td>
      <td>{dateText}</td>
    </tr>
  );
}

export default memo(TaskRow, (prev, next) => {
  const a = prev.task || {};
  const b = next.task || {};
  return a.title === b.title && a.status === b.status && a.createdAt === b.createdAt;
});
