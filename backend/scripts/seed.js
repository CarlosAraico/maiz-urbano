import db from '../db.js';
import { recipes, subrecipes, materials, products, costs } from '../data/seedData.js';

// Clear tables
db.exec(`
  DELETE FROM ingredients;
  DELETE FROM steps;
  DELETE FROM tips;
  DELETE FROM subrecipe_ingredients;
  DELETE FROM costs;
  DELETE FROM products;
  DELETE FROM materials;
  DELETE FROM recipes;
  DELETE FROM subrecipes;
`);

const insertRecipe = db.prepare(`
  INSERT INTO recipes (id, title, tag, subtitle, description, base_servings, prep_time, cook_time, temp, difficulty, color)
  VALUES (@id, @title, @tag, @subtitle, @description, @base_servings, @prep_time, @cook_time, @temp, @difficulty, @color)
`);

const insertIng = db.prepare(`
  INSERT INTO ingredients (recipe_id, name, quantity, unit, type)
  VALUES (@recipe_id, @name, @quantity, @unit, @type)
`);

const insertStep = db.prepare(`
  INSERT INTO steps (recipe_id, step_index, title, description)
  VALUES (@recipe_id, @step_index, @title, @description)
`);

const insertTip = db.prepare(`
  INSERT INTO tips (recipe_id, body)
  VALUES (@recipe_id, @body)
`);

const insertSub = db.prepare(`
  INSERT INTO subrecipes (id, category, title, yield, color, process)
  VALUES (@id, @category, @title, @yield, @color, @process)
`);

const insertSubIng = db.prepare(`
  INSERT INTO subrecipe_ingredients (sub_id, name, amount)
  VALUES (@sub_id, @name, @amount)
`);

const insertMat = db.prepare('INSERT INTO materials (id, name, unit, unit_cost, supplier) VALUES (@id, @name, @unit, @unit_cost, @supplier)');
const insertProd = db.prepare('INSERT INTO products (id, name, recipe_id, price, notes) VALUES (@id, @name, @recipe_id, @price, @notes)');
const insertCost = db.prepare('INSERT INTO costs (recipe_id, product_id, batch_size, labor_cost, packaging_cost, overhead, notes) VALUES (@recipe_id, @product_id, @batch_size, @labor_cost, @packaging_cost, @overhead, @notes)');

const seed = db.transaction(() => {
  recipes.forEach(recipe => {
    insertRecipe.run(recipe);
    recipe.ingredients.forEach(ing => insertIng.run({ recipe_id: recipe.id, ...ing }));
    recipe.steps.forEach((step, idx) => insertStep.run({ recipe_id: recipe.id, step_index: idx, ...step }));
    recipe.tips.forEach(body => insertTip.run({ recipe_id: recipe.id, body }));
  });

  subrecipes.forEach(sub => {
    insertSub.run(sub);
    sub.ingredients.forEach(ing => insertSubIng.run({ sub_id: sub.id, ...ing }));
  });

  materials.forEach(m => insertMat.run(m));
  products.forEach(p => insertProd.run(p));
  costs.forEach(c => insertCost.run(c));
});

seed();
console.log('DB seeded with demo data.');
