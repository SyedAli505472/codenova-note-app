export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new Error("Cannot reach the server. Start the backend and try again.");
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = data?.detail;
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg.replace(/^Value error, /, "")).join(" ")
      : typeof detail === "string"
        ? detail
        : response.status >= 500
          ? "The server is unavailable. Start the backend and try again."
          : "The server could not complete this request.";
    throw new Error(message);
  }
  return data;
}
