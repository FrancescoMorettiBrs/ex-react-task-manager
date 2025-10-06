import { useRef, useState, useMemo } from "react";
import { useGlobal } from "../../context/GlobalContext";

const symbols = `!@#$%^&*()-_=+[]{}|;:'\\",.<>?/\\\`~`;

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const descriptionRef = useRef(null);
  const statusRef = useRef(null);

  const { addTask } = useGlobal();

  const forbiddenRegex = useMemo(() => {
    const escaped = symbols.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    return new RegExp(`[${escaped}]`);
  }, []);

  function validateTitle(value) {
    if (!value.trim()) return "Il nome del task è obbligatorio.";
    if (forbiddenRegex.test(value)) return "Il nome non può contenere simboli speciali.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const err = validateTitle(title);
    setTitleError(err);
    if (err) return;

    const payload = {
      title: title.trim(),
      description: descriptionRef.current?.value ?? "",
      status: statusRef.current?.value ?? "To do",
    };

    try {
      setSubmitting(true);
      await addTask(payload); // ✅ POST + update stato globale
      setSubmitSuccess("Task creato con successo!"); // ✅ alert successo

      setTitle("");
      if (descriptionRef.current) descriptionRef.current.value = "";
      if (statusRef.current) statusRef.current.value = "To do";
    } catch (error) {
      setSubmitError(error.message || "Errore nella creazione del task"); // ✅ alert errore
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setTitle("");
    setTitleError("");
    setSubmitError("");
    setSubmitSuccess("");
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (statusRef.current) statusRef.current.value = "To do";
  }

  return (
    <section className="container py-4">
      <h1 className="h3 mb-3">Aggiungi Task</h1>

      {submitSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {submitSuccess}
          <button type="button" className="btn-close" onClick={() => setSubmitSuccess("")} aria-label="Close" />
        </div>
      )}

      {submitError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {submitError}
          <button type="button" className="btn-close" onClick={() => setSubmitError("")} aria-label="Close" />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* TITLE (controllato) */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Nome del task
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className={`form-control ${titleError ? "is-invalid" : ""}`}
            placeholder="Es. Implementare pagina Login"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError("");
            }}
          />
          {titleError && <div className="invalid-feedback">{titleError}</div>}
          <div className="form-text">
            Evita i simboli: <code>{symbols}</code>
          </div>
        </div>

        {/* DESCRIPTION (non controllato) */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Descrizione
          </label>
          <textarea id="description" name="description" className="form-control" rows={4} placeholder="Dettagli, note operative, checklist..." ref={descriptionRef} />
        </div>

        {/* STATUS (non controllato) */}
        <div className="mb-4">
          <label htmlFor="status" className="form-label">
            Stato
          </label>
          <select id="status" name="status" className="form-select" defaultValue="To do" ref={statusRef}>
            <option value="To do">To do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
          <div className="form-text">Valore predefinito: “To do”.</div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Salvataggio…" : "Aggiungi"}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={submitting}>
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
