/* ============================================================
   INGREDIENT ALIASES
   Other names people type for the same ingredient.
   Left side: what a person might type (lower case).
   Right side: the ingredient key the app uses.

   Rules:
   - Only exact phrases match. "chicken breast" matches chicken.
     "chicken stock" does not, because it is not listed here.
   - Nothing is guessed. A word that is not listed stays as typed.
   - To add a name, add one line.
   ============================================================ */
const GROUPS = {
  eggs: ['egg', 'itlog', 'tamago'],
  chicken: ['chicken breast', 'chicken breasts', 'chicken thigh', 'chicken thighs', 'chicken leg', 'chicken legs',
    'chicken drumstick', 'chicken drumsticks', 'chicken wing', 'chicken wings', 'chicken fillet', 'ground chicken', 'manok'],
  pork: ['pork belly', 'pork chop', 'pork chops', 'pork loin', 'pork shoulder', 'ground pork', 'sliced pork', 'liempo', 'baboy'],
  beef: ['ground beef', 'sliced beef', 'beef slices', 'beef strips', 'thinly sliced beef', 'baka'],
  fish: ['salmon', 'tilapia', 'bangus', 'mackerel', 'isda'],
  shrimp: ['shrimps', 'prawn', 'prawns', 'hipon'],
  tofu: ['firm tofu', 'silken tofu', 'soft tofu', 'tokwa'],
  rice: ['cooked rice', 'white rice', 'steamed rice', 'leftover rice', 'day old rice', 'jasmine rice', 'japanese rice', 'kanin', 'gohan'],
  noodles: ['noodle'],
  potatoes: ['potato', 'patatas'],
  carrots: ['carrot'],
  cabbage: ['green cabbage', 'repolyo'],
  onions: ['onion', 'red onion', 'red onions', 'white onion', 'white onions', 'yellow onion', 'yellow onions', 'sibuyas'],
  garlic: ['garlic clove', 'garlic cloves', 'bawang'],
  tomatoes: ['tomato', 'kamatis'],
  ginger: ['fresh ginger', 'luya'],
  'green onions': ['green onion', 'scallion', 'scallions', 'spring onion', 'spring onions', 'negi'],
  eggplant: ['eggplants', 'aubergine', 'aubergines', 'japanese eggplant', 'talong', 'nasu'],
  'bell pepper': ['bell peppers', 'capsicum'],
  mushrooms: ['mushroom', 'shiitake'],
  'soy sauce': ['toyo', 'shoyu', 'light soy sauce'],
  vinegar: ['white vinegar', 'cane vinegar', 'rice vinegar', 'apple cider vinegar', 'suka'],
  miso: ['miso paste', 'white miso', 'red miso', 'awase miso'],
  'curry roux': ['japanese curry roux', 'curry roux block', 'curry roux blocks', 'curry cube', 'curry cubes', 'curry block', 'curry blocks'],
  /* Used by recipes, but not shown as tappable fridge items. */
  dashi: ['dashi stock', 'dashi powder', 'dashi granules', 'hondashi'],
  'bay leaf': ['bay leaves', 'laurel', 'laurel leaf', 'laurel leaves'],
  patis: ['fish sauce'],
};

export const ALIASES = {};
Object.keys(GROUPS).forEach((key) => {
  GROUPS[key].forEach((alias) => { ALIASES[alias] = key; });
});
