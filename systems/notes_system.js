export function createNotesSystem({ state, saveState, saveStateNow }) {
  // fallback safe getter
  function getState() {
    return state;
  }

  function ensureNotesStore() {
    const s = getState();

    if (!Array.isArray(s.captainNotes)) {
      s.captainNotes = [];
    }
  }

  function getAllNotes() {
    ensureNotesStore();
    return getState().captainNotes;
  }

  function addNote(text) {
    if (!text || !text.trim()) return;

    ensureNotesStore();

    const note = {
      id: Date.now(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    getState().captainNotes.unshift(note);

    if (typeof saveStateNow === "function") {
      saveStateNow();
    } else if (typeof saveState === "function") {
      saveState();
    }
  }

  function deleteNote(id) {
    ensureNotesStore();

    const s = getState();
    s.captainNotes = s.captainNotes.filter(n => n.id !== id);

    if (typeof saveStateNow === "function") {
      saveStateNow();
    } else if (typeof saveState === "function") {
      saveState();
    }
  }

  function renderCaptainNotes() {
    ensureNotesStore();

    const container = document.getElementById("captain-notes-list");
    if (!container) return;

    const notes = getAllNotes();

    container.innerHTML = notes.length
      ? notes.map(n => `
          <div class="note">
            <div class="note-text">${n.text}</div>
            <button onclick="deleteCaptainNote(${n.id})">Delete</button>
          </div>
        `).join("")
      : "<p>No notes yet.</p>";
  }

  // expose delete globally (for buttons)
  window.deleteCaptainNote = deleteNote;

  return {
    getAllNotes,
    addNote,
    deleteNote,
    renderCaptainNotes,
  };
}
