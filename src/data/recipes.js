/* ============================================================
   BUILT-IN RECIPES
   To add a recipe: copy one object below and edit it.

   Every ingredient has:
   - "key"   the plain ingredient name used for matching
   - "name"  the text shown to the user
   - "qty"   how much the recipe needs
   - "role"  one of:
       essential  defines the dish (chicken in Chicken Adobo)
       required   needed, but not the defining ingredient
       optional   garnish, side or suggested extra
   - "staple: true" instead of a role, for kitchen basics.
     The app assumes every kitchen has these five basics:
     water, salt, black pepper, sugar and cooking oil.
     Basics are never checked and never counted as missing.
   - "note"  (optional) one short extra line for the user
   - "anyOf" (optional) other keys that also satisfy this line

   Recipe fields:
   - "serves"   how many people it feeds
   - "time"     minutes of cooking. "timeNote" says what it assumes.
   - "notes"    short things to know before starting
   - "image"    the photo file inside public/. If the file is
                missing, the drawn dish picture is shown instead.
   - "imageCredit"  the photographer or licence note
   ============================================================ */
export const RECIPES = [
  {
    id: 'chicken-adobo', name: 'Chicken Adobo', cuisine: 'Filipino', serves: '3 to 4', time: 45,
    image: 'images/chicken-adobo.webp', imageCredit: '',
    blurb: 'Savory, tangy chicken braised in soy sauce and vinegar.',
    notes: [],
    ingredients: [
      { key: 'chicken', role: 'essential', name: 'Chicken, bone-in pieces', qty: '600 g' },
      { key: 'vinegar', role: 'essential', name: 'Vinegar', qty: '3 tbsp' },
      { key: 'soy sauce', role: 'required', name: 'Soy sauce', qty: '4 tbsp' },
      { key: 'garlic', role: 'required', name: 'Garlic, crushed', qty: '6 cloves' },
      { key: 'bay leaf', role: 'optional', name: 'Bay leaf', qty: '2 leaves' },
      { key: 'rice', role: 'optional', name: 'Cooked rice, to serve', qty: 'as much as you like' },
      { key: 'water', staple: true, name: 'Water', qty: '1 cup' },
      { key: 'pepper', staple: true, name: 'Black pepper, whole or ground', qty: '1 tsp whole, or 1/2 tsp ground' },
      { key: 'oil', staple: true, name: 'Cooking oil', qty: '1 tbsp' },
    ],
    steps: [
      'Brown the chicken in the oil. Set it aside.',
      'Fry the garlic in the same pot until golden.',
      'Return the chicken. Add the soy sauce, vinegar, water and black pepper. Add the bay leaves if using.',
      'Simmer for 30 minutes with the lid half on. Do not stir for the first 10 minutes.',
      'Cook until the sauce thickens. Good with rice.',
    ],
  },
  {
    id: 'tortang-talong', name: 'Tortang Talong', cuisine: 'Filipino', serves: '2', time: 25,
    image: 'images/tortang-talong.webp', imageCredit: '',
    blurb: 'Smoky grilled eggplant dipped in egg and pan-fried.',
    notes: [],
    ingredients: [
      { key: 'eggplant', role: 'essential', name: 'Eggplant, long', qty: '2 pieces' },
      { key: 'eggs', role: 'essential', name: 'Eggs', qty: '2' },
      { key: 'onions', role: 'optional', name: 'Onion, finely chopped', qty: '1/2' },
      { key: 'salt', staple: true, name: 'Salt and black pepper', qty: 'to taste' },
      { key: 'oil', staple: true, name: 'Cooking oil', qty: '2 tbsp' },
    ],
    steps: [
      'Grill or broil the eggplants until the skin is charred and the flesh is soft.',
      'Peel off the skin. Keep the stem on.',
      'Beat the eggs with salt and pepper. Stir in the onion if using.',
      'Flatten each eggplant with a fork. Dip it in the egg.',
      'Fry in hot oil for 3 minutes per side until golden.',
    ],
  },
  {
    id: 'ginisang-repolyo', name: 'Ginisang Repolyo', cuisine: 'Filipino', serves: '2 to 3', time: 20,
    image: 'images/ginisang-repolyo.webp', imageCredit: '',
    blurb: 'Quick sauteed cabbage with garlic and onion. Add pork or carrot if you have them.',
    notes: ['Works with cabbage, garlic and onion alone. Pork and carrot are extras.'],
    ingredients: [
      { key: 'cabbage', role: 'essential', name: 'Cabbage, sliced', qty: '1/2 head' },
      { key: 'garlic', role: 'required', name: 'Garlic, minced', qty: '3 cloves' },
      { key: 'onions', role: 'required', name: 'Onion, sliced', qty: '1' },
      { key: 'pork', role: 'optional', name: 'Pork, thinly sliced', qty: '150 g' },
      { key: 'carrots', role: 'optional', name: 'Carrot, sliced thin', qty: '1' },
      { key: 'patis', anyOf: ['soy sauce', 'oyster sauce'], role: 'optional', name: 'Patis, soy sauce or oyster sauce', qty: '1 tbsp of one' },
      { key: 'salt', staple: true, name: 'Salt and black pepper', qty: 'to taste' },
      { key: 'oil', staple: true, name: 'Cooking oil', qty: '1 tbsp' },
    ],
    steps: [
      'Fry the garlic and onion in the oil until soft.',
      'If using pork, add it now. Cook until it is no longer pink.',
      'If using carrot, add it now. Stir for 2 minutes.',
      'Add the cabbage. Cook for 3 to 4 minutes so it stays a little crisp.',
      'Season with salt and pepper. If using patis, soy sauce or oyster sauce, add 1 tbsp and use less salt. Serve hot.',
    ],
  },
  {
    id: 'sinangag', name: 'Sinangag with Egg', cuisine: 'Filipino', serves: '2', time: 15,
    timeNote: 'Time assumes the rice is already cooked and cold.',
    image: 'images/sinangag.webp', imageCredit: '',
    blurb: 'Garlic fried rice topped with a fried egg.',
    notes: ['The rice must be cooked and cooled first. Uncooked rice will not work. Day-old rice is best.'],
    ingredients: [
      { key: 'rice', role: 'essential', name: 'Cooked rice, cold', qty: '3 cups', note: 'Must be cooked and cooled before you start.' },
      { key: 'garlic', role: 'essential', name: 'Garlic, minced', qty: '6 cloves' },
      { key: 'eggs', role: 'essential', name: 'Eggs', qty: '2' },
      { key: 'salt', staple: true, name: 'Salt', qty: 'to taste' },
      { key: 'oil', staple: true, name: 'Cooking oil', qty: '2 tbsp' },
    ],
    steps: [
      'Break up the cold cooked rice with your hands.',
      'Fry the garlic in the oil on low heat until golden and crisp.',
      'Add the rice. Turn the heat to high and toss for 4 minutes.',
      'Season with salt.',
      'Fry the eggs in a separate pan. Place them on the rice.',
    ],
  },
  {
    id: 'oyakodon', name: 'Home-Style Oyakodon', cuisine: 'Japanese', serves: '2', time: 25,
    timeNote: 'Time assumes the rice is already cooked.',
    image: 'images/oyakodon.webp', imageCredit: '',
    blurb: 'A simple home-style version. Chicken and egg simmered together over rice.',
    notes: ['This is a simple home version. Dashi and mirin give a more classic taste, but it works without them.'],
    ingredients: [
      { key: 'chicken', role: 'essential', name: 'Chicken thigh, bite-size', qty: '250 g' },
      { key: 'eggs', role: 'essential', name: 'Eggs, lightly beaten', qty: '3' },
      { key: 'onions', role: 'required', name: 'Onion, sliced', qty: '1/2' },
      { key: 'rice', role: 'required', name: 'Cooked rice, hot', qty: '2 bowls', note: 'Cook the rice first.' },
      { key: 'soy sauce', role: 'required', name: 'Soy sauce', qty: '2 tbsp' },
      { key: 'dashi', role: 'optional', name: 'Dashi stock', qty: '1/2 cup', note: 'Use it instead of the water.' },
      { key: 'mirin', role: 'optional', name: 'Mirin', qty: '1 tbsp' },
      { key: 'sugar', staple: true, name: 'Sugar', qty: '1 tbsp' },
      { key: 'water', staple: true, name: 'Water', qty: '1/2 cup' },
    ],
    steps: [
      'Simmer the water, soy sauce and sugar in a small pan. If using dashi, use it instead of the water. Add the mirin if using.',
      'Add the onion and chicken. Cook for 8 minutes, until the chicken is cooked through.',
      'Pour the beaten egg over the chicken in a circle.',
      'Cover for 1 minute for soft egg. For fully cooked egg, cover for 2 to 3 minutes until set.',
      'Slide everything over the hot rice.',
    ],
  },
  {
    id: 'japanese-curry', name: 'Japanese Curry Rice', cuisine: 'Japanese', serves: '4', time: 45,
    timeNote: 'Time assumes the rice is already cooked.',
    image: 'images/japanese-curry.webp', imageCredit: '',
    blurb: 'Thick curry with chunky vegetables over rice. Add chicken if you like.',
    notes: [
      'Roux brands differ. Follow the roux and water amounts on your box.',
      'Works without meat. Just skip the chicken.',
    ],
    ingredients: [
      { key: 'curry roux', role: 'essential', name: 'Japanese curry roux', qty: 'about 4 blocks', note: 'Check your box for the right amount.' },
      { key: 'potatoes', role: 'required', name: 'Potatoes, cubed', qty: '2' },
      { key: 'carrots', role: 'required', name: 'Carrot, cut in chunks', qty: '1' },
      { key: 'onions', role: 'required', name: 'Onions, sliced', qty: '2' },
      { key: 'rice', role: 'required', name: 'Cooked rice', qty: '4 bowls', note: 'Cook the rice first.' },
      { key: 'chicken', role: 'optional', name: 'Chicken, bite-size', qty: '300 g' },
      { key: 'water', staple: true, name: 'Water', qty: 'about 3 cups, or as your roux box says' },
      { key: 'oil', staple: true, name: 'Cooking oil', qty: '1 tbsp' },
    ],
    steps: [
      'Fry the onions in the oil until soft and lightly brown.',
      'If using chicken, add it now. Cook until the outside turns white.',
      'Add the potatoes, carrot and water. Simmer for 15 minutes, until the potatoes are soft.',
      'Turn off the heat. Stir in the curry roux until it melts.',
      'Simmer on low for 5 more minutes. Serve next to the rice.',
    ],
  },
  {
    id: 'miso-soup', name: 'Tofu Miso Soup', cuisine: 'Japanese', serves: '2', time: 10,
    image: 'images/miso-soup.webp', imageCredit: '',
    blurb: 'A warm, simple soup ready in ten minutes.',
    notes: [
      'Check your miso label. Some miso paste already contains dashi. Many do not.',
      'Plain miso needs dashi. Without it the soup tastes flat.',
    ],
    ingredients: [
      { key: 'miso', role: 'essential', name: 'Miso paste', qty: '2 tbsp' },
      { key: 'tofu', role: 'essential', name: 'Tofu, small cubes', qty: '150 g' },
      { key: 'dashi', role: 'required', name: 'Dashi, stock or powder', qty: '2 cups of stock, or powder as the packet says', note: 'Skip only if your miso paste already contains dashi.' },
      { key: 'green onions', role: 'optional', name: 'Green onion, sliced', qty: '1 stalk' },
      { key: 'water', staple: true, name: 'Water', qty: '2 cups' },
    ],
    steps: [
      'Heat the water until it almost boils. Stir in the dashi powder. If you have dashi stock, use it instead of the water. Skip the dashi only if your miso already contains it.',
      'Add the tofu. Warm it for 2 minutes.',
      'Turn the heat to low. Dissolve the miso in a ladle of the hot liquid, then stir it in.',
      'Do not boil after adding the miso.',
      'Top with green onion if using.',
    ],
  },
  {
    id: 'gyudon', name: 'Home-Style Gyudon Beef Bowl', cuisine: 'Japanese', serves: '2', time: 20,
    timeNote: 'Time assumes the rice is already cooked.',
    image: 'images/gyudon.webp', imageCredit: '',
    blurb: 'A simple home-style version. Thin beef and sweet onion simmered over rice.',
    notes: ['This is a simple home version. Dashi, mirin and ginger give a more classic taste, but it works without them.'],
    ingredients: [
      { key: 'beef', role: 'essential', name: 'Beef, very thinly sliced', qty: '250 g' },
      { key: 'onions', role: 'required', name: 'Onion, sliced', qty: '1' },
      { key: 'rice', role: 'required', name: 'Cooked rice, hot', qty: '2 bowls', note: 'Cook the rice first.' },
      { key: 'soy sauce', role: 'required', name: 'Soy sauce', qty: '3 tbsp' },
      { key: 'ginger', role: 'optional', name: 'Ginger, grated', qty: '1 tsp' },
      { key: 'dashi', role: 'optional', name: 'Dashi stock', qty: '1/2 cup', note: 'Use it instead of the water.' },
      { key: 'mirin', role: 'optional', name: 'Mirin', qty: '1 tbsp' },
      { key: 'sugar', staple: true, name: 'Sugar', qty: '1 tbsp' },
      { key: 'water', staple: true, name: 'Water', qty: '1/2 cup' },
    ],
    steps: [
      'Simmer the water, soy sauce and sugar. If using dashi, use it instead of the water. Add the ginger and mirin if using.',
      'Add the onion. Cook for 5 minutes until soft.',
      'Add the beef. Separate the slices as they cook.',
      'Simmer for 4 minutes. Skim off any foam. Taste the sauce. Add a little water if it is too salty.',
      'Spoon the beef and sauce over the hot rice.',
    ],
  },
  {
    id: 'tomato-egg', name: 'Tomato Egg Stir-Fry', cuisine: 'International', serves: '2', time: 15,
    image: 'images/tomato-egg.webp', imageCredit: '',
    blurb: 'A Chinese home-style classic. Soft scrambled egg in a sweet, juicy tomato sauce.',
    notes: [],
    ingredients: [
      { key: 'tomatoes', role: 'essential', name: 'Tomatoes, cut in wedges', qty: '3' },
      { key: 'eggs', role: 'essential', name: 'Eggs', qty: '4' },
      { key: 'green onions', role: 'optional', name: 'Green onion, sliced', qty: '1 stalk' },
      { key: 'sugar', staple: true, name: 'Sugar', qty: '1 tsp' },
      { key: 'salt', staple: true, name: 'Salt', qty: 'to taste' },
      { key: 'oil', staple: true, name: 'Cooking oil', qty: '2 tbsp' },
    ],
    steps: [
      'Beat the eggs. Scramble them in the hot oil until just set. Take them out.',
      'Cook the tomatoes in the same pan for 3 minutes until juicy.',
      'Add the sugar and salt.',
      'Return the eggs. Fold gently for 30 seconds.',
      'Top with green onion if using.',
    ],
  },
  {
    id: 'spanish-omelette', name: 'Potato Spanish Omelette', cuisine: 'International', serves: '4', time: 35,
    image: 'images/spanish-omelette.webp', imageCredit: '',
    blurb: 'A classic from Spain, also called tortilla de patatas. A thick, golden omelette of potato and onion.',
    notes: ['This recipe needs about 1/2 cup of oil. A small splash is not enough. The potatoes cook slowly in it.'],
    ingredients: [
      { key: 'potatoes', role: 'essential', name: 'Potatoes, thinly sliced', qty: '3 medium' },
      { key: 'eggs', role: 'essential', name: 'Eggs', qty: '5' },
      { key: 'onions', role: 'required', name: 'Onion, thinly sliced', qty: '1' },
      { key: 'salt', staple: true, name: 'Salt', qty: '1 tsp' },
      { key: 'oil', staple: true, name: 'Olive or cooking oil', qty: 'about 1/2 cup', note: 'Much more than usual. Check that you have enough.' },
    ],
    steps: [
      'Heat the 1/2 cup of oil. Cook the potatoes and onion in it slowly for 15 minutes. They should be soft, not brown.',
      'Beat the eggs with the salt in a large bowl. Drain the potatoes and onion, and keep 1 tbsp of the oil. Stir the potatoes and onion into the eggs.',
      'Heat the 1 tbsp of saved oil in the pan. Pour in the mixture. Cook on low for 6 minutes.',
      'Flip it using a plate. Cook the other side for 4 minutes.',
      'Rest for 5 minutes. Cut into wedges.',
    ],
  },
];
