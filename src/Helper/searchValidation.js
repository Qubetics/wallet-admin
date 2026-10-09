// '%' is a SQL LIKE wildcard that the backend does not escape (returns the whole
// dataset), and the backend rejects HTML silently. Block both with a clear message.
export const getSearchError = (text) => {
  if (!text) return "";
  if (text.includes("%")) return "The '%' character is not allowed in search";
  if (/[<>]/.test(text)) return "HTML characters (< >) are not allowed in search";
  return "";
};
