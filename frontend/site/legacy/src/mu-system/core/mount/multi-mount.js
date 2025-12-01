export function mountMultiple(blocks) {
  Object.entries(blocks).forEach(([fn, id]) => {
    if (typeof window[fn] === "function") {
      window[fn](id);
    } else {
      console.warn(`MU: función ${fn} no encontrada.`);
    }
  });
}
