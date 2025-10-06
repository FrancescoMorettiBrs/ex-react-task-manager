import { useMemo, useState, useRef, useCallback } from "react";
import { useGlobal } from "../../context/GlobalContext";
import { TaskRow } from "../../components/TaskRow";

const STATUS_ORDER = { "To do": 0, Doing: 1, Done: 2 };

function getStatusLabel(t = {}) {
  if (typeof t.status === "string") return t.status;
  if (t.completed === true) return "Done";
  if (t.inProgress === true) return "Doing";
  return "To do";
}

function getCreatedTime(t = {}) {
  const raw = t.createdAt ?? t.created_at ?? null;
  const d = typeof raw === "number" ? new Date(raw) : new Date(String(raw));
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

function SortHeader({ label, column, sortBy, sortOrder, onClick }) {
  const active = sortBy === column;
  const icon = active ? (sortOrder === 1 ? "▲" : "▼") : "↕";
  return (
    <th
      scope="col"
      role="button"
      onClick={() => onClick(column)}
      className="user-select-none"
      style={{ cursor: "pointer" }}
      aria-sort={active ? (sortOrder === 1 ? "ascending" : "descending") : "none"}
      title={active ? `Ordina ${sortOrder === 1 ? "↓ crescente" : "↑ decrescente"}` : "Clicca per ordinare"}
    >
      {label} <span className="text-body-secondary">{icon}</span>
    </th>
  );
}

function debounce(fn, delay) {
  let timerId;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
}

export default function TaskList() {
  const { tasks, loading, error, reload } = useGlobal();

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState(1);

  function handleSort(col) {
    if (sortBy === col) {
      setSortOrder((prev) => (prev === 1 ? -1 : 1));
    } else {
      setSortBy(col);
      setSortOrder(1);
    }
  }

  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  const onDebouncedInput = useCallback(
    debounce((val) => {
      setSearchQuery(val.trim().toLowerCase());
    }, 300),
    []
  );

  const visibleTasks = useMemo(() => {
    const list = Array.isArray(tasks) ? [...tasks] : [];
    const q = searchQuery;

    const filtered = q ? list.filter((t) => (t.title ?? t.name ?? "").toString().toLowerCase().includes(q)) : list;

    const factor = sortOrder === 1 ? 1 : -1;

    return filtered.sort((a, b) => {
      if (sortBy === "title") {
        const at = (a.title ?? a.name ?? "").toString();
        const bt = (b.title ?? b.name ?? "").toString();
        const cmp = at.localeCompare(bt, undefined, { sensitivity: "base" });
        return cmp * factor;
      }

      if (sortBy === "status") {
        const as = STATUS_ORDER[getStatusLabel(a)] ?? 999;
        const bs = STATUS_ORDER[getStatusLabel(b)] ?? 999;
        const cmp =
          as === bs
            ? (a.title ?? "").toString().localeCompare((b.title ?? "").toString(), undefined, {
                sensitivity: "base",
              })
            : as - bs;
        return cmp * factor;
      }

      const at = getCreatedTime(a);
      const bt = getCreatedTime(b);
      const cmp =
        at === bt
          ? (a.title ?? "").toString().localeCompare((b.title ?? "").toString(), undefined, {
              sensitivity: "base",
            })
          : at - bt;
      return cmp * factor;
    });
  }, [tasks, sortBy, sortOrder, searchQuery]);

  return (
    <section>
      <h1 className="h3 mb-3">Lista dei Task</h1>

      <div className="mb-3">
        <label htmlFor="taskSearch" className="form-label mb-1">
          Cerca per nome
        </label>
        <div className="input-group">
          <input id="taskSearch" type="search" className="form-control" placeholder="Es. login, homepage…" ref={searchRef} onChange={(e) => onDebouncedInput(e.target.value)} />
          <button
            type="button"
            className="btn btn-outline-secondary ms-2"
            onClick={() => {
              if (searchRef.current) searchRef.current.value = "";
              setSearchQuery("");
            }}
          >
            Pulisci
          </button>
        </div>
      </div>

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
              <SortHeader label="Nome" column="title" sortBy={sortBy} sortOrder={sortOrder} onClick={handleSort} />
              <SortHeader label="Stato" column="status" sortBy={sortBy} sortOrder={sortOrder} onClick={handleSort} />
              <SortHeader label="Data di Creazione" column="createdAt" sortBy={sortBy} sortOrder={sortOrder} onClick={handleSort} />
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
              visibleTasks.length > 0 &&
              visibleTasks.map((t) => {
                const key = t?.id ?? t?._id ?? `${t?.title ?? "task"}-${t?.createdAt ?? Math.random()}`;
                return <TaskRow key={key} task={t} />;
              })}

            {!loading && visibleTasks.length === 0 && !error && (
              <tr>
                <td colSpan={3} className="text-center text-body-secondary py-4">
                  {searchQuery ? `Nessun task trovato per “${searchQuery}”.` : "Nessun task disponibile"}
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
