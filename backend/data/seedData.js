export const recipes = [
  {
    id: 'elote',
    title: 'ELOTE MONTADO',
    tag: 'THE O.G.',
    subtitle: 'Cocción Mineral en Tequesquite',
    description: 'No es el elote de la esquina, es CIENCIA CALLEJERA. Maíz criollo cocido en solución mineral (tequesquite) para mantener el crunch y el color. Montado con precisión.',
    base_servings: 50,
    prep_time: 20,
    cook_time: 90,
    temp: '95-98°C',
    difficulty: 'Hardcore',
    color: 'yellow',
    cover_image: 'https://images.unsplash.com/photo-1633328320102-19c7b4441782?q=80&w=1200&auto=format&fit=crop',
    ingredients: [
      { name: 'Elotes Criollos Frescos', quantity: 50, unit: 'pz', type: 'base' },
      { name: 'Agua Filtrada', quantity: 20, unit: 'L', type: 'base' },
      { name: 'Tequesquite', quantity: 40, unit: 'g', type: 'base' },
      { name: 'Sal de Grano', quantity: 50, unit: 'g', type: 'base' },
      { name: 'Totomoxtle Limpio', quantity: 25, unit: 'pz', type: 'base' },
      { name: 'Mayonesa Estandarizada', quantity: 1500, unit: 'g', type: 'montaje' },
      { name: 'Queso Cotija/Fresco', quantity: 1500, unit: 'g', type: 'montaje' },
      { name: 'Topping (Crunch)', quantity: 1500, unit: 'g', type: 'montaje' }
    ],
    steps: [
      { title: 'El Laboratorio Líquido', description: 'Olla de acero. 20L de agua + Tequesquite + Sal. Hervor suave.' },
      { title: 'Armor Up', description: 'Limpia los elotes pero deja la última hoja. Cúbrelos con totomoxtle.' },
      { title: 'La Espera', description: 'Fuego controlado (95-98°C). Blanco: 60-70min | Rojo: 75-80min | Azul: 80-90min.' },
      { title: 'Reposo Táctico', description: 'Apaga el fuego. Déjalos en el agua 20 mins para fijar minerales.' },
      { title: 'Mise en Place', description: 'Baño María a 65-70°C. 8 horas de vida útil.' },
      { title: 'Drop It Like It\'s Hot', description: 'Palo, capa fina de mayo, queso, topping, limón.' }
    ],
    tips: [
      'Ojo con el maíz azul: si te pasas de tiempo, la cáscara se pone chiclosa.',
      'El reposo no es opcional: fija sabor a tierra mojada.',
      'Menos es más: 20g de mayo es suficiente.'
    ]
  },
  {
    id: 'esquites',
    title: 'ESQUITES FRITOS',
    tag: 'STREET LEGEND',
    subtitle: 'Sofrito de Manteca y Epazote',
    description: 'Olvídate de los esquites hervidos. Grano cocido + manteca + epazote. Sabor profundo, textura compleja.',
    base_servings: 50,
    prep_time: 40,
    cook_time: 30,
    temp: 'Fuego Medio',
    difficulty: 'Media',
    color: 'lime',
    cover_image: 'https://images.unsplash.com/photo-1604908177703-22d6bd4c9b69?q=80&w=1200&auto=format&fit=crop',
    ingredients: [
      { name: 'Grano Cocido', quantity: 9000, unit: 'g', type: 'base' },
      { name: 'Manteca de Cerdo', quantity: 700, unit: 'g', type: 'sofrito' },
      { name: 'Cebolla Picada', quantity: 500, unit: 'g', type: 'sofrito' },
      { name: 'Ajo Fino', quantity: 150, unit: 'g', type: 'sofrito' },
      { name: 'Epazote Fresco', quantity: 50, unit: 'g', type: 'sazon' },
      { name: 'Caldo de Cocción', quantity: 1500, unit: 'ml', type: 'sazon' },
      { name: 'Sal Fina', quantity: 75, unit: 'g', type: 'sazon' },
      { name: 'Mayonesa', quantity: 1500, unit: 'g', type: 'montaje' },
      { name: 'Queso', quantity: 1500, unit: 'g', type: 'montaje' }
    ],
    steps: [
      { title: 'Prep del Grano', description: 'Desgrana el elote cocido. Debe estar firme.' },
      { title: 'Base Grasa', description: 'Marmita caliente. Manteca. Acitrona cebolla y ajo sin quemar.' },
      { title: 'El Salteado', description: 'Echa el grano. 10 minutos de movimiento constante.' },
      { title: 'Sazón Final', description: 'Epazote, sal, caldo. Tapa y baja fuego 10 mins. Debe ser jugoso, no sopa.' },
      { title: 'El Vaso', description: '250g por vaso. Capas visibles.' }
    ],
    tips: [
      'Sin manteca no hay paraíso.',
      'Cebolla translúcida, nunca dorada.',
      'Es un estofado de maíz, no un caldo.'
    ]
  }
];

export const subrecipes = [
  {
    id: 'mayo-madre',
    category: 'BASES',
    title: 'Mayonesa Madre',
    yield: '1 L',
    color: 'zinc',
    ingredients: [
      { name: 'Mayo Comercial', amount: '800g' },
      { name: 'Leche Evaporada', amount: '200g' },
      { name: 'Knorr', amount: '10g' }
    ],
    process: 'Licúa todo. Emulsión perfecta. Divide y saboriza después.'
  },
  {
    id: 'crema-habanero',
    category: 'HOT STUFF',
    title: 'Crema Habanero',
    yield: '1 L',
    color: 'orange',
    ingredients: [
      { name: 'Habanero Tatemado', amount: '400g' },
      { name: 'Aceite', amount: '500ml' },
      { name: 'Agua', amount: '200ml' }
    ],
    process: 'Tatema. Licúa con agua. Hilo de aceite para emulsionar.'
  },
  {
    id: 'salsa-macha-seeds',
    category: 'CRUNCH',
    title: 'Salsa Macha Seeds',
    yield: '1 L',
    color: 'red',
    ingredients: [
      { name: 'Aceite Mix', amount: '1L' },
      { name: 'Semillas', amount: '200g' },
      { name: 'Chiles Secos', amount: '150g' }
    ],
    process: 'Confita semillas. Fríe chiles rápido. Licúa martajado.'
  },
  {
    id: 'mixes-callejeros',
    category: 'TOPPINGS',
    title: 'Mixes Callejeros',
    yield: '30g/pax',
    color: 'yellow',
    ingredients: [
      { name: 'Doritos/Ruffles', amount: '30g' },
      { name: 'Hot Nuts', amount: '30g' }
    ],
    process: 'Triturado medio. El cliente manda.'
  }
];

export const materials = [
  { id: 'elote-criollo', name: 'Elote Criollo', unit: 'pz', unit_cost: 6.5, supplier: 'Productor local' },
  { id: 'manteca-cerdo', name: 'Manteca de cerdo', unit: 'g', unit_cost: 0.04, supplier: 'Proveedor A' },
  { id: 'epazote', name: 'Epazote fresco', unit: 'g', unit_cost: 0.06, supplier: 'Mercado' }
];

export const products = [
  { id: 'elote-og', name: 'Elote OG', recipe_id: 'elote', price: 45, notes: 'Porción estándar' },
  { id: 'vaso-esquites', name: 'Vaso de esquites', recipe_id: 'esquites', price: 55, notes: '250g' }
];

export const costs = [
  { recipe_id: 'elote', product_id: 'elote-og', batch_size: 50, labor_cost: 400, packaging_cost: 200, overhead: 150, notes: 'Incluye gas' }
];
