export default function AddTask() {
  return (
    <section>
      <h1 className="h3 mb-3">Aggiungi Task</h1>
      <form>
        <div className="mb-3">
          <label className="form-label">Titolo</label>
          <input className="form-control" name="title" placeholder="Titolo del task" />
        </div>
        <div className="mb-3">
          <label className="form-label">Descrizione</label>
          <textarea className="form-control" name="description" rows="4" placeholder="Descrizione" />
        </div>
        <button type="submit" className="btn btn-primary">
          Aggiungi
        </button>
      </form>
    </section>
  );
}
