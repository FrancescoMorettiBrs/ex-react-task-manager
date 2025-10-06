import { useParams, Link, useNavigate } from "react-router-dom";
import { useGlobal } from "../../context/GlobalContext";
import { useState } from "react";

function formatDate(value) {
  if (!value) return "—";
  const d = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, loading, error, removeTask } = useGlobal();
  const [deleting, setDeleting] = useState(false);

  const task = tasks.find((t) => String(t?.id ?? t?._id) === String(id));

  if (loading) return <p>Caricamento…</p>;
  if (error) return <p className="text-danger">Errore: {error}</p>;
  if (!task) {
    return (
      <section className="container py-4">
        <p className="text-body-secondary">Task non trovato.</p>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          Torna alla lista
        </Link>
      </section>
    );
  }

  const title = task.title ?? task.name ?? `Task #${id}`;
  const description = task.description ?? "—";
  const status = typeof task.status === "string" ? task.status : task.completed === true ? "Done" : task.inProgress === true ? "Doing" : "To do";
  const createdAt = task.createdAt ?? task.created_at ?? null;

  async function handleDelete() {
    if (deleting) return;
    try {
      setDeleting(true);
      await removeTask(id);
      alert("Task eliminata con successo!");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.message || "Errore nell'eliminazione del task");
      setDeleting(false);
    }
  }

  return (
    <section className="container py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="h3 mb-0">{title}</h1>
        <Link to="/" className="btn btn-sm btn-outline-secondary">
          ← Indietro
        </Link>
      </div>

      <hr />

      <dl className="row">
        <dt className="col-sm-3">Descrizione</dt>
        <dd className="col-sm-9">{description}</dd>

        <dt className="col-sm-3">Stato</dt>
        <dd className="col-sm-9">{status}</dd>

        <dt className="col-sm-3">Data di creazione</dt>
        <dd className="col-sm-9">{formatDate(createdAt)}</dd>
      </dl>

      <div className="mt-4">
        <button className="btn btn-outline-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? "Eliminazione…" : "Elimina Task"}
        </button>
      </div>
    </section>
  );
}
