export function registerNotesSystem(BQ) {
  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderCaptainNotes() {
    const list = BQ.$("captain-notes-list");
    if (!list) return;

    const notes = Array.isArray(BQ.state.captainNotes) ? BQ.state.captainNotes : [];

    if (!notes.length) {
      list.innerHTML = `
        <div style="
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px;
          padding:12px;
          background:#111;
          color:var(--muted);
        ">
          No captain notes saved yet.
        </div>
      `;
      return;
    }

    list.innerHTML = notes
      .map(
        (note, index) => `
          <div style="
            border:1px solid rgba(255,255,255,0.08);
            border-radius:14px;
            padding:12px;
            background:#111;
          ">
            <div style="font-size:12px;color:var(--gold);margin-bottom:6px;">
              NOTE ${notes.length - index}
            </div>
            <div style="white-space:pre-wrap;line-height:1.45;">${escapeHtml(note.text)}</div>
            <div style="margin-top:6px;font-size:11px;color:var(--muted);">
              ${note.kind ? String(note.kind).toUpperCase() : "NOTE"} • ${
          note.createdAt ? new Date(note.createdAt).toLocaleString() : "saved"
        }
            </div>
            <div style="margin-top:10px;">
              <button
                class="win-btn captain-note-delete-btn"
                data-note-id="${note.id}"
                style="background:#2a2a2a;color:#fff;"
              >
                DELETE
              </button>
            </div>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".captain-note-delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        deleteCaptainNote(btn.dataset.noteId);
      });
    });
  }

  function saveCaptainNote(text, kind = "note", source = "") {
    const clean = String(text || "").trim();
    if (!clean) return false;

    if (!Array.isArray(BQ.state.captainNotes)) {
      BQ.state.captainNotes = [];
    }

    BQ.state.captainNotes.unshift({
      id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text: clean,
      kind,
      source,
      createdAt: new Date
