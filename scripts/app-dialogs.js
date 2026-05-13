function getSwal() {
  if (typeof globalThis !== "undefined" && globalThis.Swal) return globalThis.Swal;
  if (typeof window !== "undefined" && window.Swal) return window.Swal;
  return null;
}

/** @param {"success"|"error"|"warning"|"info"|"question"} icon */
export function notify(message, icon = "info") {
  const Swal = getSwal();
  if (Swal) {
    return Swal.fire({
      icon,
      text: message,
      confirmButtonText: "OK",
    });
  }
  window.alert(message);
  return Promise.resolve();
}

export const notifySuccess = (message) => notify(message, "success");
export const notifyWarning = (message) => notify(message, "warning");
export const notifyError = (message) => notify(message, "error");
export const notifyInfo = (message) => notify(message, "info");

export async function confirmDialog(message, options = {}) {
  const Swal = getSwal();
  const { confirmText = "Yes", cancelText = "Cancel" } = options;
  if (Swal) {
    const { isConfirmed } = await Swal.fire({
      icon: "question",
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    });
    return isConfirmed;
  }
  return window.confirm(message);
}
