import { useGlobal } from "../../context/GlobalContext";
import { TaskRow } from "../../components/TaskRow";

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
                return <TaskRow key={key} task={t} />;
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
