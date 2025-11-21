import { render, screen } from '@testing-library/react';
import RecipeCard from './RecipeCard.jsx';

const recipe = {
  id: 'elote',
  title: 'Elote Test',
  tag: 'OG',
  subtitle: 'Demo',
  description: 'Desc',
  base_servings: 10,
  cook_time: 50,
  temp: '95C',
  difficulty: 'Media',
  color: 'yellow',
  cover_image: '',
  ingredients: [{ name: 'Maíz', quantity: 100, unit: 'g', type: 'base' }],
  steps: [{ title: 'Paso 1', description: 'Uno' }],
  tips: ['Tip']
};

it('muestra cantidades escaladas', () => {
  render(<RecipeCard recipe={recipe} scale={20} onScale={() => {}} onStart={() => {}} />);
  expect(screen.getByText(/200g/)).toBeInTheDocument();
});
