const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

let authToken = '';

export const setAuthToken = (token) => {
  authToken = token;
};

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    },
    ...options
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export const fetchRecipes = () => request('/recipes');
export const fetchSubrecipes = () => request('/subrecipes');
export const fetchMaterials = () => request('/materials');
export const fetchProducts = () => request('/products');
export const fetchCosts = () => request('/costs');

export const saveRecipe = (recipe) => request('/recipes', {
  method: 'POST',
  body: JSON.stringify(recipe)
});

export const saveSubrecipe = (sub) => request('/subrecipes', {
  method: 'POST',
  body: JSON.stringify(sub)
});

export const saveMaterial = (mat) => request('/materials', {
  method: 'POST',
  body: JSON.stringify(mat)
});

export const saveProduct = (prod) => request('/products', {
  method: 'POST',
  body: JSON.stringify(prod)
});

export const saveCost = (cost) => request('/costs', {
  method: 'POST',
  body: JSON.stringify(cost)
});
