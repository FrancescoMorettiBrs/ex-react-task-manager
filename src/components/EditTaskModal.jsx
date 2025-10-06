import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

const symbols = `!@#$%^&*()-_=+[]{}|;:'\\",.<>?/\\\`~`;

export default function EditTaskModal({ show, onClose, task, onSave }) {
  const formRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To do");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    if (!task) return;
    setTitle(task.title ?? task.name ?? "");
    setDescription(task.description ?? "");
    setStatus(typeof task.status === "string" ? task.status : task.completed === true ? "Done" : task.inProgress === true ? "Doing" : "To do");
    setTitleError("");
  }, [task, show]);

  function validateTitle(value) {
    if (!value.trim()) return "Il nome del task è obbligatorio.";
    const escaped = symbols.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const forbidden = new RegExp(`[${escaped}]`);
    if (forbidden.test(value)) return "Il nome non può contenere simboli speciali.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validateTitle(title);
    setTitleError(err);
    if (err) return;

    const updatedTask = {
      id: task?.id ?? task?._id,
      title: title.trim(),
      description,
      status,
    };

    onSave?.(updatedTask);
  }

  return (
    <Modal
      title="Modifica Task"
      content={
        <div className="p-3">
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="edit-title" className="form-label">
                Nome
              </label>
              <input
                id="edit-title"
                type="text"
                className={`form-control ${titleError ? "is-invalid" : ""}`}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError("");
                }}
              />
              {titleError && <div className="invalid-feedback">{titleError}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="edit-description" className="form-label">
                Descrizione
              </label>
              <textarea id="edit-description" className="form-control" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="mb-0">
              <label htmlFor="edit-status" className="form-label">
                Stato
              </label>
              <select id="edit-status" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To do">To do</option>
                <option value="Doing">Doing</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </form>
        </div>
      }
      show={show}
      onClose={onClose}
      confirmText="Salva"
      onConfirm={() => formRef.current?.requestSubmit()}
    />
  );
}
