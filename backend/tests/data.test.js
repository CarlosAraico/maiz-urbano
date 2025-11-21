import assert from 'assert';
import { recipes, subrecipes } from '../data/seedData.js';

const isPositive = (n) => typeof n === 'number' && n > 0;

// Recipes shape
recipes.forEach((r) => {
  assert(r.id && r.title, 'Recipe needs id and title');
  assert(isPositive(r.base_servings), 'base_servings must be > 0');
  assert(Array.isArray(r.ingredients) && r.ingredients.length > 0, 'ingredients required');
  assert(Array.isArray(r.steps) && r.steps.length > 0, 'steps required');
  r.ingredients.forEach((ing) => {
    assert(ing.name, 'ingredient name');
    assert(isPositive(ing.quantity), 'ingredient quantity > 0');
    assert(typeof ing.unit === 'string', 'ingredient unit string');
    assert(['base', 'sofrito', 'sazon', 'montaje'].includes(ing.type), 'ingredient type controlled');
  });
  r.steps.forEach((s) => {
    assert(s.title && s.description, 'step title & description');
  });
});

// Subrecipes shape
subrecipes.forEach((s) => {
  assert(s.id && s.title, 'Subrecipe needs id/title');
  assert(Array.isArray(s.ingredients) && s.ingredients.length > 0, 'subrecipe ingredients');
  s.ingredients.forEach((ing) => {
    assert(ing.name && ing.amount, 'sub-ing name/amount');
  });
});

console.log('Data tests passed: recipe structures valid.');
