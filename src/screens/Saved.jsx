import Brand from '../components/Brand.jsx';
import PageHead from '../components/PageHead.jsx';
import Empty from '../components/Empty.jsx';
import { RecipeCards } from '../components/RecipeCard.jsx';

export default function Saved(p) {
  const list = p.list.filter((x) => p.isSaved(x.recipe.id));
  return (
    <>
      <Brand className="mobile-brand" />
      <PageHead title="Saved" color="#D81B60"
        text={list.length ? 'Your favorite recipes, kept in one place.' : 'Recipes you love will show up here.'} />
      {list.length === 0 ? (
        <Empty icon="heart" title="No saved recipes yet" text="Tap the heart on any recipe to keep it here."
          action="Browse recipes" onAction={() => p.go('recipes')} />
      ) : (
        <div className="grid">
          <RecipeCards items={list} variant="list" isSaved={p.isSaved} toggleSave={p.toggleSave} open={p.open} />
        </div>
      )}
    </>
  );
}
