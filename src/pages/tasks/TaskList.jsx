import { TaskRow } from "../../components/TaskRow";
import { useGlobal } from "../../context/GlobalContext";

export default function TaskList() {
  const { tasks } = useGlobal();

  return (
    <section>
      <h1 className="h3 mb-3">Lista dei Task</h1>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Stato</th>
              <th scope="col">Data di Creazione</th>
            </tr>
          </thead>
          <tbody style={{cursor: "pointer"}}>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((t) => {
                const key = t?.id ?? t?._id ?? `${t?.title ?? ""}-${t?.createdAt ?? Math.random()}`;
                return <TaskRow key={key} task={t} />;
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-body-secondary py-4">
                  Nessun task disponibile
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
