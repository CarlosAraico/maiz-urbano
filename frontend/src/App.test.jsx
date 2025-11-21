import { render, screen, waitFor } from '@testing-library/react';
import App from './App.jsx';
import { vi } from 'vitest';

const mockRecipes = [
  {
    id: 'elote',
    title: 'Elote test',
    tag: 'OG',
    subtitle: 'Sub',
    description: 'Desc',
    base_servings: 10,
    cook_time: 60,
    temp: '95C',
    difficulty: 'Media',
    color: 'yellow',
    cover_image: '',
    ingredients: [{ name: 'Grano', quantity: 100, unit: 'g', type: 'base' }],
    steps: [{ title: 'Paso 1', description: 'Hacer algo' }],
    tips: ['Tip uno']
  }
];

const mockResponse = (data) => ({
  ok: true,
  status: 200,
  json: async () => data
});

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.endsWith('/recipes')) return Promise.resolve(mockResponse(mockRecipes));
    if (url.endsWith('/subrecipes')) return Promise.resolve(mockResponse([]));
    if (url.endsWith('/materials')) return Promise.resolve(mockResponse([]));
    if (url.endsWith('/products')) return Promise.resolve(mockResponse([]));
    if (url.endsWith('/costs')) return Promise.resolve(mockResponse([]));
    return Promise.resolve(mockResponse({}));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('renderiza hero y permite ver receta', async () => {
  render(<App />);
  expect(screen.getByText(/maíz urbano/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/Elote test/i)).toBeInTheDocument();
  });
});
