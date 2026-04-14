export function createModalSystem({ $ }) {
  function hideAllModals() {
    document.querySelectorAll(".full-modal").forEach((el) => {
      el.style.display = "none";
    });
  }

  function showModal(id) {
    hideAllModals();
    const el = $(id);
    if (el) el.style.display = "block";
  }

  function closeModal(id) {
    const el = $(id);
    if (el) el.style.display = "none";
  }

  return {
    hideAllModals,
    showModal,
    closeModal,
  };
}
