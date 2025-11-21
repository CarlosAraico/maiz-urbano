import express from 'express';
import cors from 'cors';
import db from './db.js';

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'super-secret-token';

const app = express();
app.use(cors());
app.use(express.json());

const selectRecipes = db.prepare('SELECT * FROM recipes ORDER BY title ASC');
const selectRecipe = db.prepare('SELECT * FROM recipes WHERE id = ?');
const selectIngs = db.prepare('SELECT name, quantity, unit, type FROM ingredients WHERE recipe_id = ? ORDER BY id');
const selectSteps = db.prepare('SELECT step_index, title, description FROM steps WHERE recipe_id = ? ORDER BY step_index');
const selectTips = db.prepare('SELECT body FROM tips WHERE recipe_id = ? ORDER BY id');

const selectSubrecipes = db.prepare('SELECT * FROM subrecipes ORDER BY title ASC');
const selectSubrecipe = db.prepare('SELECT * FROM subrecipes WHERE id = ?');
const selectSubIngs = db.prepare('SELECT name, amount FROM subrecipe_ingredients WHERE sub_id = ? ORDER BY id');

const selectMaterials = db.prepare('SELECT * FROM materials ORDER BY name ASC');
const selectMaterial = db.prepare('SELECT * FROM materials WHERE id = ?');
const insertMaterial = db.prepare('INSERT INTO materials (id, name, unit, unit_cost, supplier) VALUES (@id, @name, @unit, @unit_cost, @supplier)');
const updateMaterial = db.prepare('UPDATE materials SET name=@name, unit=@unit, unit_cost=@unit_cost, supplier=@supplier WHERE id=@id');

const selectProducts = db.prepare('SELECT * FROM products ORDER BY name ASC');
const selectProduct = db.prepare('SELECT * FROM products WHERE id = ?');
const insertProduct = db.prepare('INSERT INTO products (id, name, recipe_id, price, notes) VALUES (@id, @name, @recipe_id, @price, @notes)');
const updateProduct = db.prepare('UPDATE products SET name=@name, recipe_id=@recipe_id, price=@price, notes=@notes WHERE id=@id');

const selectCosts = db.prepare('SELECT * FROM costs ORDER BY id DESC');
const insertCost = db.prepare('INSERT INTO costs (recipe_id, product_id, batch_size, labor_cost, packaging_cost, overhead, notes) VALUES (@recipe_id, @product_id, @batch_size, @labor_cost, @packaging_cost, @overhead, @notes)');
const updateCost = db.prepare('UPDATE costs SET recipe_id=@recipe_id, product_id=@product_id, batch_size=@batch_size, labor_cost=@labor_cost, packaging_cost=@packaging_cost, overhead=@overhead, notes=@notes WHERE id=@id');

const insertRecipe = db.prepare(`
  INSERT INTO recipes (id, title, tag, subtitle, description, base_servings, prep_time, cook_time, temp, difficulty, color, cover_image)
  VALUES (@id, @title, @tag, @subtitle, @description, @base_servings, @prep_time, @cook_time, @temp, @difficulty, @color, @cover_image)
`);

const updateRecipeBase = db.prepare(`
  UPDATE recipes SET title=@title, tag=@tag, subtitle=@subtitle, description=@description, base_servings=@base_servings,
    prep_time=@prep_time, cook_time=@cook_time, temp=@temp, difficulty=@difficulty, color=@color, cover_image=@cover_image
  WHERE id=@id
`);

const insertIng = db.prepare('INSERT INTO ingredients (recipe_id, name, quantity, unit, type) VALUES (@recipe_id, @name, @quantity, @unit, @type)');
const insertStep = db.prepare('INSERT INTO steps (recipe_id, step_index, title, description) VALUES (@recipe_id, @step_index, @title, @description)');
const insertTip = db.prepare('INSERT INTO tips (recipe_id, body) VALUES (@recipe_id, @body)');

const deleteRecipeDeps = db.transaction((id) => {
  db.prepare('DELETE FROM ingredients WHERE recipe_id=?').run(id);
  db.prepare('DELETE FROM steps WHERE recipe_id=?').run(id);
  db.prepare('DELETE FROM tips WHERE recipe_id=?').run(id);
});

const upsertRecipe = db.transaction((payload) => {
  const exists = selectRecipe.get(payload.id);
  if (exists) {
    updateRecipeBase.run(payload);
    deleteRecipeDeps(payload.id);
  } else {
    insertRecipe.run(payload);
  }
  payload.ingredients?.forEach((ing) => insertIng.run({ recipe_id: payload.id, ...ing }));
  payload.steps?.forEach((step, idx) => insertStep.run({ recipe_id: payload.id, step_index: idx, ...step }));
  payload.tips?.forEach((body) => insertTip.run({ recipe_id: payload.id, body }));
});

const insertSub = db.prepare('INSERT INTO subrecipes (id, category, title, yield, color, process) VALUES (@id, @category, @title, @yield, @color, @process)');
const updateSub = db.prepare('UPDATE subrecipes SET category=@category, title=@title, yield=@yield, color=@color, process=@process WHERE id=@id');
const deleteSubIngs = db.prepare('DELETE FROM subrecipe_ingredients WHERE sub_id=?');
const insertSubIng = db.prepare('INSERT INTO subrecipe_ingredients (sub_id, name, amount) VALUES (@sub_id, @name, @amount)');

const upsertSubrecipe = db.transaction((payload) => {
  const exists = selectSubrecipe.get(payload.id);
  if (exists) {
    updateSub.run(payload);
    deleteSubIngs.run(payload.id);
  } else {
    insertSub.run(payload);
  }
  payload.ingredients?.forEach((ing) => insertSubIng.run({ sub_id: payload.id, ...ing }));
});

const hydrateRecipe = (row) => {
  if (!row) return null;
  return {
    ...row,
    cover_image: row.cover_image,
    ingredients: selectIngs.all(row.id),
    steps: selectSteps.all(row.id).map((s) => ({ title: s.title, description: s.description })),
    tips: selectTips.all(row.id).map((t) => t.body)
  };
};

const hydrateSubrecipe = (row) => {
  if (!row) return null;
  return { ...row, ingredients: selectSubIngs.all(row.id) };
};

const validateRecipe = (data) => {
  const required = ['id', 'title', 'base_servings'];
  for (const key of required) {
    if (!data?.[key]) return `Falta campo requerido: ${key}`;
  }
  if (data.cover_image && typeof data.cover_image !== 'string') return 'cover_image debe ser string (URL)';
  if (!Array.isArray(data.ingredients)) return 'ingredients debe ser arreglo';
  if (!Array.isArray(data.steps)) return 'steps debe ser arreglo';
  if (!Array.isArray(data.tips)) return 'tips debe ser arreglo';
  return null;
};

const validateSubrecipe = (data) => {
  const required = ['id', 'category', 'title'];
  for (const key of required) if (!data?.[key]) return `Falta campo requerido: ${key}`;
  if (!Array.isArray(data.ingredients)) return 'ingredients debe ser arreglo';
  return null;
};

const validateMaterial = (m) => {
  const required = ['id', 'name', 'unit', 'unit_cost'];
  for (const key of required) if (!m?.[key]) return `Falta ${key}`;
  if (Number.isNaN(Number(m.unit_cost))) return 'unit_cost debe ser numérico';
  return null;
};

const validateProduct = (p) => {
  const required = ['id', 'name'];
  for (const key of required) if (!p?.[key]) return `Falta ${key}`;
  if (p.price && Number.isNaN(Number(p.price))) return 'price debe ser numérico';
  return null;
};

const validateCost = (c) => {
  if (c.batch_size && Number.isNaN(Number(c.batch_size))) return 'batch_size numérico';
  ['labor_cost', 'packaging_cost', 'overhead'].forEach((k) => {
    if (c[k] && Number.isNaN(Number(c[k]))) throw new Error(`${k} debe ser numérico`);
  });
  return null;
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const basic = `Basic ${Buffer.from(`admin:${AUTH_TOKEN}`).toString('base64')}`;
  const bearer = `Bearer ${AUTH_TOKEN}`;
  if (header !== bearer && header !== basic) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/recipes', (_req, res) => {
  const rows = selectRecipes.all();
  res.json(rows.map(hydrateRecipe));
});

app.get('/api/recipes/:id', (req, res) => {
  const recipe = hydrateRecipe(selectRecipe.get(req.params.id));
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

app.post('/api/recipes', requireAuth, (req, res) => {
  const error = validateRecipe(req.body);
  if (error) return res.status(400).json({ error });
  try {
    upsertRecipe(req.body);
    res.status(201).json(hydrateRecipe(selectRecipe.get(req.body.id)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/recipes/:id', requireAuth, (req, res) => {
  const payload = { ...req.body, id: req.params.id };
  const error = validateRecipe(payload);
  if (error) return res.status(400).json({ error });
  try {
    upsertRecipe(payload);
    res.json(hydrateRecipe(selectRecipe.get(req.params.id)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/subrecipes', (_req, res) => {
  res.json(selectSubrecipes.all().map(hydrateSubrecipe));
});

app.get('/api/subrecipes/:id', (req, res) => {
  const sub = hydrateSubrecipe(selectSubrecipe.get(req.params.id));
  if (!sub) return res.status(404).json({ error: 'Subrecipe not found' });
  res.json(sub);
});

app.post('/api/subrecipes', requireAuth, (req, res) => {
  const error = validateSubrecipe(req.body);
  if (error) return res.status(400).json({ error });
  try {
    upsertSubrecipe(req.body);
    res.status(201).json(hydrateSubrecipe(selectSubrecipe.get(req.body.id)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/subrecipes/:id', requireAuth, (req, res) => {
  const payload = { ...req.body, id: req.params.id };
  const error = validateSubrecipe(payload);
  if (error) return res.status(400).json({ error });
  try {
    upsertSubrecipe(payload);
    res.json(hydrateSubrecipe(selectSubrecipe.get(req.params.id)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Materials
app.get('/api/materials', (_req, res) => res.json(selectMaterials.all()));
app.post('/api/materials', requireAuth, (req, res) => {
  const err = validateMaterial(req.body);
  if (err) return res.status(400).json({ error: err });
  try {
    const exists = selectMaterial.get(req.body.id);
    if (exists) updateMaterial.run(req.body); else insertMaterial.run(req.body);
    res.status(exists ? 200 : 201).json(selectMaterial.get(req.body.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Products
app.get('/api/products', (_req, res) => res.json(selectProducts.all()));
app.post('/api/products', requireAuth, (req, res) => {
  const err = validateProduct(req.body);
  if (err) return res.status(400).json({ error: err });
  try {
    const exists = selectProduct.get(req.body.id);
    if (exists) updateProduct.run(req.body); else insertProduct.run(req.body);
    res.status(exists ? 200 : 201).json(selectProduct.get(req.body.id));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Costs
app.get('/api/costs', (_req, res) => res.json(selectCosts.all()));
app.post('/api/costs', requireAuth, (req, res) => {
  try {
    validateCost(req.body);
    if (req.body.id) {
      updateCost.run(req.body);
      return res.json(req.body);
    }
    const info = insertCost.run(req.body);
    return res.status(201).json({ id: info.lastInsertRowid, ...req.body });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
