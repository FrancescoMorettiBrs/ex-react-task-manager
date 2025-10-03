import { useGlobal } from "../../context/GlobalContext";

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

export default function TaskList() {
  const { tasks, loading, error, reload } = useGlobal();

  return (
    <section>
      <h1 className="h3 mb-3">Lista dei Task</h1>

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>Errore: {error}</span>
          <button className="btn btn-sm btn-light" onClick={reload}>
            Riprova
          </button>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Stato</th>
              <th scope="col">Data di Creazione</th>
            </tr>
          </thead>

          <tbody style={{ cursor: "pointer" }}>
            {loading && (
              <tr>
                <td colSpan={3} className="text-center text-body-secondary py-4">
                  Caricamento…
                </td>
              </tr>
            )}

            {!loading &&
              Array.isArray(tasks) &&
              tasks.length > 0 &&
              tasks.map((t) => {
                const key = t?.id ?? t?._id ?? `${t?.title ?? "task"}-${t?.createdAt ?? Math.random()}`;
                const title = t?.title ?? t?.name ?? `Task #${t?.id ?? t?._id ?? "—"}`;
                const createdAt = t?.createdAt ?? t?.created_at ?? null;

                const label = getStatusLabel(t);
                const statusClass = statusCellClass(label);

                return (
                  <tr key={key}>
                    <td className="fw-medium">{title}</td>
                    <td className={statusClass}>{label}</td>
                    <td>{formatDate(createdAt)}</td>
                  </tr>
                );
              })}

            {!loading && (!Array.isArray(tasks) || tasks.length === 0) && !error && (
              <tr>
                <td colSpan={3} className="text-center text-body-secondary py-4">
                  Nessun task disponibile
                  <div className="mt-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={reload}>
                      Ricarica
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
