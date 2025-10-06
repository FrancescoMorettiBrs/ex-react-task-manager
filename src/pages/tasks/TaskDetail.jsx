import { useParams, Link, useNavigate } from "react-router-dom";
import { useGlobal } from "../../context/GlobalContext";
import { useState } from "react";
import Modal from "../../components/Modal";
import EditTaskModal from "../../components/EditTaskModal";

function formatDate(value) {
  if (!value) return "—";
  const d = typeof value === "number" ? new Date(value) : new Date(String(value));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, loading, error, removeTask, updateTask } = useGlobal();

  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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

  async function confirmDelete() {
    if (deleting) return;
    try {
      setDeleting(true);
      await removeTask(id);
      setConfirmOpen(false);
      alert("Task eliminata con successo!");
      navigate("/", { replace: true });
    } catch (err) {
      setConfirmOpen(false);
      alert(err.message || "Errore nell'eliminazione del task");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSave(updatedTask) {
    try {
      await updateTask(updatedTask);
      alert("Task modificata con successo!");
      setEditOpen(false);
    } catch (err) {
      alert(err.message || "Errore nella modifica del task");
    }
  }

  return (
    <section className="container py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="h3 mb-0">{title}</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={() => setEditOpen(true)}>
            Modifica Task
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmOpen(true)} disabled={deleting}>
            Elimina Task
          </button>
          <Link to="/" className="btn btn-sm btn-outline-secondary">
            ← Indietro
          </Link>
        </div>
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

      <Modal
        title="Confermi l’eliminazione?"
        content={
          <div className="p-3">
            <p className="mb-1">
              Stai per eliminare <strong>{title}</strong>.
            </p>
            <small className="text-body-secondary">Questa azione non è reversibile.</small>
          </div>
        }
        show={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        confirmText={deleting ? "Eliminazione…" : "Elimina"}
      />

      <EditTaskModal show={editOpen} onClose={() => setEditOpen(false)} task={task} onSave={handleSave} />
    </section>
  );
}
