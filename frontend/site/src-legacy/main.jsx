// Preview mínimo sin React build; solo escribe HTML en #mu-root
const root = document.getElementById('mu-root');
if (root) {
  root.innerHTML = `
    <div style="border:1px dashed var(--border); padding:16px; border-radius:12px">
      <h3 style="font-family: var(--font-heading); margin:0 0 6px">Preview simple</h3>
      <p style="opacity:.85; margin:0">Este archivo simula un entrypoint para previsualizar componentes.</p>
    </div>
  `;
}
