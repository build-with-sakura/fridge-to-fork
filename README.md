# Fridge to Fork

**Your fridge has possibilities.**

Fridge to Fork finds recipes you can cook with what is already in your fridge.
Pick your ingredients. See what you can cook now, what is almost ready, and what needs shopping.

This is a React app built with Vite. It has no backend, no login and no paid services.

## What the app does

- Four tabs: Home, My Fridge, Recipes, Saved
- Search and tap ingredients, or add your own
- Recipe matching in three groups: Can Cook Now, Almost There, Need to Shop
- Recipe details with a "To buy" list and a copy button
- Cuisine filter
- Saved recipes
- Your fridge and saved recipes stay in the browser (local storage)

## Folder guide

```
fridge-to-fork/
├── index.html                 The single web page
├── package.json               Project name and tools it needs
├── vite.config.js             Build settings, including the base path
├── public/
│   └── images/                Recipe photos go here
├── src/
│   ├── main.jsx               Starts the app
│   ├── App.jsx                Tabs, fridge, saved list, matching
│   ├── screens/               One file per screen
│   ├── components/            Reusable pieces (cards, nav, photo, icons)
│   ├── data/                  Recipes, ingredients, matching rules
│   ├── lib/                   Small helpers (storage, image paths, labels)
│   └── styles/app.css         All colors, fonts and layout
└── .github/workflows/deploy.yml   Builds and publishes to GitHub Pages
```

## Run it on your computer (optional)

You need [Node.js](https://nodejs.org) version 20 or newer.

```bash
npm install
npm run dev
```

Then open the address shown in the terminal.

To make the final files:

```bash
npm run build
```

The finished site appears in the `dist` folder.

## Publish to GitHub Pages

1. Create a new repository on GitHub. Make it **Public**.
2. Open **Settings**, then **Pages**. Under **Source**, choose **GitHub Actions**.
3. Upload all the files in this folder to the `main` branch.
4. Open the **Actions** tab. Wait for "Deploy to GitHub Pages" to show a green check.
5. Your site is at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY-NAME/`

Every time you change a file on `main`, the site rebuilds by itself.

**Important:** the `.github` folder must be uploaded too. Its name starts with a dot, so some computers hide it.

## The base path

GitHub Pages serves this site from a sub-folder, such as `/fridge-to-fork/`.
The app handles that in two ways:

- By default the build uses relative paths (`./`). These work in any folder.
- The GitHub workflow sets `BASE_PATH` to the correct sub-folder for you.

To set it by hand:

```bash
BASE_PATH=/fridge-to-fork/ npm run build
```

Recipe photos use the same base path, so they load from the sub-folder too.

## Add recipe photos

1. Put the photo in `public/images/`.
2. Name it exactly as listed in `public/images/README.md`.
3. Add the photographer or licence note to `imageCredit` in `src/data/recipes.js`.

Until a photo is added, the app shows a drawn dish instead. Nothing breaks.

Only use photos you own or have a licence for.

## Add or edit a recipe

Open `src/data/recipes.js`. Copy one recipe and change it.

- `key` is the plain ingredient name used for matching.
- `role` is `essential`, `required` or `optional`. See "How matching works" below.
- `staple: true` marks a kitchen basic. Use it only for water, salt, black pepper, sugar and cooking oil.
- If you add a new ingredient, also add it to `src/data/ingredients.js` so users can tap it.

## How matching works

Every recipe ingredient has a role.

| Role | Meaning |
| --- | --- |
| Essential | Defines the dish. Chicken in Chicken Adobo. |
| Required | Needed, but not the defining ingredient. |
| Optional | Garnish, side or suggested extra. Never affects the result. |
| Kitchen basic | Water, salt, black pepper, sugar, cooking oil. Never checked. |

| Result | Rule |
| --- | --- |
| Can Cook Now | Every essential and required ingredient is there |
| Almost There | Every essential is there, you have at least half of essential + required, and only 1 or 2 required are missing |
| Need to Shop | Everything else |

Things to know:

- The app knows which ingredients you have. It does not know how much you have.
- Kitchen basics are assumed, not checked. Each recipe lists the amounts.
- "Rice" means you have rice. Recipes that need cooked rice say so.

## Other names for ingredients

`src/data/aliases.js` lists other names people type, such as "chicken breast" for chicken.
Only exact names in that list are matched. Nothing is guessed.
To add a name, add one line to that file.

## Tests

```bash
npm test
```

This checks the recipe data, the ingredient names and every matching rule.
The same tests run on GitHub before each build.

## Not built yet

- TheMealDB connection. A converter is ready in `src/data/mealdb.js`, but nothing uses it.
- Real recipe photos.
- The 10 recipes are samples. Please check them before sharing the app widely.
