import { Link, useNavigate } from "react-router-dom";

function formatDate(value) {
  if (!value) return "—";
  const d = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

function getStatusLabel(t = {}) {
  if (typeof t.status === "string") return t.status;
  if (t.completed === true) return "Done";
  if (t.inProgress === true) return "Doing";
  return "To do";
}

function statusCellClass(label) {
  switch (label) {
    case "To do":
      return "bg-danger text-white";
    case "Doing":
      return "bg-warning";
    case "Done":
      return "bg-success text-white";
    default:
      return "";
  }
}

export function TaskRow({ task }) {
  const navigate = useNavigate();
  const id = task?.id ?? task?._id;
  const title = task?.title ?? task?.name ?? `Task #${id ?? "—"}`;
  const createdAt = task?.createdAt ?? task?.created_at ?? null;

  const label = getStatusLabel(task);
  const statusClass = statusCellClass(label);

  const goDetail = () => {
    if (id) navigate(`/task/${id}`);
  };

  return (
    <tr
      className="table-row-clickable"
      onClick={goDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goDetail();
        }
      }}
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer" }}
    >
      <td className="fw-medium">
        {id ? (
          <Link to={`/task/${id}`} className="text-body text-decoration-none" onClick={(e) => e.stopPropagation()}>
            {title}
          </Link>
        ) : (
          <span className="text-body">{title}</span>
        )}
      </td>
      <td className={statusClass}>{label}</td>
      <td>{formatDate(createdAt)}</td>
    </tr>
  );
}
