/* ============================================================
   BUILT-IN RECIPES
   To add a recipe: copy one object below and edit it.
   - "key" is the plain ingredient name used for matching.
   - "staple: true" means a basic most kitchens have (salt, oil,
     water). Staples are never counted as missing.
   - "image" is the photo file inside public/. Put the photo in
     public/images/ with the same file name. If the file is
     missing, the drawn dish picture is shown instead.
   - "imageCredit" is the photographer or licence note.
   ============================================================ */
export const RECIPES = [
  { id: 'chicken-adobo', name: 'Chicken Adobo', cuisine: 'Filipino', time: 45, image: 'images/chicken-adobo.jpg', imageCredit: '',
    blurb: 'Savory, tangy chicken braised in soy sauce and vinegar.',
    ingredients: [
      { key: 'chicken', name: 'Chicken, bone-in pieces', qty: '600 g' },
      { key: 'garlic', name: 'Garlic, crushed', qty: '6 cloves' },
      { key: 'soy sauce', name: 'Soy sauce', qty: '4 tbsp' },
      { key: 'vinegar', name: 'Vinegar', qty: '3 tbsp' },
      { key: 'water', name: 'Water', qty: '1 cup', staple: true },
      { key: 'pepper', name: 'Whole peppercorns', qty: '1 tsp', staple: true },
      { key: 'oil', name: 'Cooking oil', qty: '1 tbsp', staple: true }
    ],
    steps: ['Brown the chicken in a little oil. Set it aside.', 'Fry the garlic in the same pot until golden.', 'Return the chicken. Add soy sauce, vinegar, water and peppercorns.', 'Simmer for 30 minutes with the lid half on. Do not stir for the first 10 minutes.', 'Cook until the sauce thickens. Serve with rice.'] },
  { id: 'tortang-talong', name: 'Tortang Talong', cuisine: 'Filipino', time: 25, image: 'images/tortang-talong.jpg', imageCredit: '',
    blurb: 'Smoky grilled eggplant dipped in egg and pan-fried.',
    ingredients: [
      { key: 'eggplant', name: 'Eggplant, long', qty: '2 pieces' },
      { key: 'eggs', name: 'Eggs', qty: '2' },
      { key: 'onions', name: 'Onion, finely chopped', qty: '1/2' },
      { key: 'salt', name: 'Salt and pepper', qty: 'to taste', staple: true },
      { key: 'oil', name: 'Cooking oil', qty: '2 tbsp', staple: true }
    ],
    steps: ['Grill or broil the eggplants until the skin is charred and the flesh is soft.', 'Peel off the skin. Keep the stem on.', 'Beat the eggs with onion, salt and pepper.', 'Flatten each eggplant with a fork. Dip it in the egg.', 'Fry in hot oil for 3 minutes per side until golden.'] },
  { id: 'ginisang-repolyo', name: 'Ginisang Repolyo', cuisine: 'Filipino', time: 20, image: 'images/ginisang-repolyo.jpg', imageCredit: '',
    blurb: 'Quick sauteed cabbage with pork, carrots and garlic.',
    ingredients: [
      { key: 'cabbage', name: 'Cabbage, sliced', qty: '1/2 head' },
      { key: 'pork', name: 'Pork, thinly sliced', qty: '150 g' },
      { key: 'carrots', name: 'Carrot, sliced thin', qty: '1' },
      { key: 'garlic', name: 'Garlic, minced', qty: '3 cloves' },
      { key: 'onions', name: 'Onion, sliced', qty: '1' },
      { key: 'salt', name: 'Salt and pepper', qty: 'to taste', staple: true },
      { key: 'oil', name: 'Cooking oil', qty: '1 tbsp', staple: true }
    ],
    steps: ['Fry the garlic and onion in oil until soft.', 'Add the pork. Cook until it is no longer pink.', 'Add the carrot. Stir for 2 minutes.', 'Add the cabbage. Cook for 3 to 4 minutes so it stays a little crisp.', 'Season with salt and pepper. Serve hot.'] },
  { id: 'sinangag', name: 'Sinangag with Egg', cuisine: 'Filipino', time: 15, image: 'images/sinangag.jpg', imageCredit: '',
    blurb: 'Garlic fried rice topped with a fried egg.',
    ingredients: [
      { key: 'rice', name: 'Cooked rice, day-old is best', qty: '3 cups' },
      { key: 'garlic', name: 'Garlic, minced', qty: '6 cloves' },
      { key: 'eggs', name: 'Eggs', qty: '2' },
      { key: 'salt', name: 'Salt', qty: 'to taste', staple: true },
      { key: 'oil', name: 'Cooking oil', qty: '2 tbsp', staple: true }
    ],
    steps: ['Break up the cold rice with your hands.', 'Fry the garlic in oil on low heat until golden and crisp.', 'Add the rice. Turn the heat to high and toss for 4 minutes.', 'Season with salt.', 'Fry the eggs in a separate pan. Place them on the rice.'] },
  { id: 'oyakodon', name: 'Oyakodon', cuisine: 'Japanese', time: 25, image: 'images/oyakodon.jpg', imageCredit: '',
    blurb: 'Chicken and soft egg simmered together over rice.',
    ingredients: [
      { key: 'chicken', name: 'Chicken thigh, bite-size', qty: '250 g' },
      { key: 'eggs', name: 'Eggs, lightly beaten', qty: '3' },
      { key: 'onions', name: 'Onion, sliced', qty: '1/2' },
      { key: 'rice', name: 'Cooked rice', qty: '2 bowls' },
      { key: 'soy sauce', name: 'Soy sauce', qty: '2 tbsp' },
      { key: 'sugar', name: 'Sugar', qty: '1 tbsp', staple: true },
      { key: 'water', name: 'Water or dashi stock', qty: '1/2 cup', staple: true }
    ],
    steps: ['Simmer the water, soy sauce and sugar in a small pan.', 'Add the onion and chicken. Cook for 8 minutes.', 'Pour the beaten egg over the chicken in a circle.', 'Cover for 1 minute. Stop while the egg is still soft.', 'Slide everything over hot rice.'] },
  { id: 'japanese-curry', name: 'Japanese Curry Rice', cuisine: 'Japanese', time: 45, image: 'images/japanese-curry.jpg', imageCredit: '',
    blurb: 'Thick, mild curry with chicken and chunky vegetables.',
    ingredients: [
      { key: 'chicken', name: 'Chicken, bite-size', qty: '300 g' },
      { key: 'potatoes', name: 'Potatoes, cubed', qty: '2' },
      { key: 'carrots', name: 'Carrot, cut in chunks', qty: '1' },
      { key: 'onions', name: 'Onions, sliced', qty: '2' },
      { key: 'curry roux', name: 'Japanese curry roux', qty: '4 blocks' },
      { key: 'rice', name: 'Cooked rice', qty: '4 bowls' },
      { key: 'water', name: 'Water', qty: '3 cups', staple: true },
      { key: 'oil', name: 'Cooking oil', qty: '1 tbsp', staple: true }
    ],
    steps: ['Fry the onions in oil until soft and lightly brown.', 'Add the chicken. Cook until the outside turns white.', 'Add potatoes, carrot and water. Simmer for 15 minutes.', 'Turn off the heat. Stir in the curry roux until it melts.', 'Simmer on low for 5 more minutes. Serve next to rice.'] },
  { id: 'miso-soup', name: 'Tofu Miso Soup', cuisine: 'Japanese', time: 10, image: 'images/miso-soup.jpg', imageCredit: '',
    blurb: 'A warm, simple soup ready in ten minutes.',
    ingredients: [
      { key: 'tofu', name: 'Tofu, small cubes', qty: '150 g' },
      { key: 'miso', name: 'Miso paste', qty: '2 tbsp' },
      { key: 'green onions', name: 'Green onion, sliced', qty: '1 stalk' },
      { key: 'water', name: 'Water or dashi stock', qty: '2 cups', staple: true }
    ],
    steps: ['Heat the water or dashi until it almost boils.', 'Add the tofu. Warm it for 2 minutes.', 'Turn the heat to low. Dissolve the miso in a ladle of the hot liquid, then stir it in.', 'Do not boil after adding miso.', 'Top with green onion.'] },
  { id: 'gyudon', name: 'Gyudon Beef Bowl', cuisine: 'Japanese', time: 20, image: 'images/gyudon.jpg', imageCredit: '',
    blurb: 'Thin beef and sweet onion simmered over rice.',
    ingredients: [
      { key: 'beef', name: 'Beef, very thinly sliced', qty: '250 g' },
      { key: 'onions', name: 'Onion, sliced', qty: '1' },
      { key: 'rice', name: 'Cooked rice', qty: '2 bowls' },
      { key: 'soy sauce', name: 'Soy sauce', qty: '3 tbsp' },
      { key: 'ginger', name: 'Ginger, grated', qty: '1 tsp' },
      { key: 'sugar', name: 'Sugar', qty: '1 tbsp', staple: true },
      { key: 'water', name: 'Water', qty: '1/2 cup', staple: true }
    ],
    steps: ['Simmer the water, soy sauce, sugar and ginger.', 'Add the onion. Cook for 5 minutes until soft.', 'Add the beef. Separate the slices as they cook.', 'Simmer for 4 minutes. Skim off any foam.', 'Spoon the beef and sauce over hot rice.'] },
  { id: 'tomato-egg', name: 'Tomato Egg Stir-Fry', cuisine: 'International', time: 15, image: 'images/tomato-egg.jpg', imageCredit: '',
    blurb: 'Soft scrambled egg in a sweet, juicy tomato sauce.',
    ingredients: [
      { key: 'tomatoes', name: 'Tomatoes, cut in wedges', qty: '3' },
      { key: 'eggs', name: 'Eggs, beaten', qty: '4' },
      { key: 'green onions', name: 'Green onion, sliced', qty: '1 stalk' },
      { key: 'sugar', name: 'Sugar', qty: '1 tsp', staple: true },
      { key: 'salt', name: 'Salt', qty: 'to taste', staple: true },
      { key: 'oil', name: 'Cooking oil', qty: '2 tbsp', staple: true }
    ],
    steps: ['Scramble the eggs in hot oil until just set. Take them out.', 'Cook the tomatoes in the same pan for 3 minutes until juicy.', 'Add the sugar and salt.', 'Return the eggs. Fold gently for 30 seconds.', 'Top with green onion.'] },
  { id: 'spanish-omelette', name: 'Potato Spanish Omelette', cuisine: 'International', time: 35, image: 'images/spanish-omelette.jpg', imageCredit: '',
    blurb: 'A thick, golden omelette of potato and onion.',
    ingredients: [
      { key: 'potatoes', name: 'Potatoes, thinly sliced', qty: '3' },
      { key: 'eggs', name: 'Eggs', qty: '5' },
      { key: 'onions', name: 'Onion, thinly sliced', qty: '1' },
      { key: 'salt', name: 'Salt', qty: '1 tsp', staple: true },
      { key: 'oil', name: 'Olive or cooking oil', qty: '1/2 cup', staple: true }
    ],
    steps: ['Cook the potatoes and onion slowly in oil for 15 minutes. They should be soft, not brown.', 'Drain the oil. Mix the potatoes into the beaten eggs with salt.', 'Pour into a hot, lightly oiled pan. Cook on low for 6 minutes.', 'Flip it using a plate. Cook the other side for 4 minutes.', 'Rest for 5 minutes. Cut into wedges.'] }
];
