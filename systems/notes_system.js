export function NotesSystem({
  getState,
  saveState,
}) {
  function ensureNotesStore() {
    const state = getState();

    if (!state.notes || typeof state.notes !== "object") {
      state.notes = [];
    }

    return state.notes;
  }

  function saveCaptainNote(text, type = "general", title = "") {
    if (!text) return;

    const notes = ensureNotesStore();

    notes.unshift({
      id: `note_${Date.now()}`,
      text,
      type,
      title,
      createdAt: new Date().toISOString(),
    });

    saveState?.();
  }

  function deleteCaptainNote(noteId) {
    const state = getState();
    if (!state.notes) return;

    state.notes = state.notes.filter((n) => n.id !== noteId);

    saveState?.();
  }

  function clearAllNotes() {
    const state = getState();
    state.notes = [];

    saveState?.();
  }

  function getAllNotes() {
    return ensureNotesStore();
  }

  function renderHomeLog() {
    const el = document.getElementById("home-list");
    if (!el) return;

    const notes = getAllNotes();

    if (!notes.length) {
      el.innerHTML = `<div class="shop-mini">No activity yet.</div>`;
      return;
    }

    el.innerHTML = notes
      .map((note) => {
        return `
          <div class="case-card">
            <div class="case-label">
              ${note.type?.toUpperCase() || "NOTE"} • ${new Date(note.createdAt).toLocaleString()}
            </div>
            <div class="case-body">${note.text}</div>
          </div>
        `;
      })
      .join("");
  }

  return {
    saveCaptainNote,
    deleteCaptainNote,
    clearAllNotes,
    getAllNotes,
    renderHomeLog,
  };
}
