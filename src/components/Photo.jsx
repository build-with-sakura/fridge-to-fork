import { useEffect, useState } from 'react';
import FoodArt from './FoodArt.jsx';
import { imageUrl } from '../lib/images.js';

/* ============================================================
   RECIPE IMAGE
   One component for every recipe picture in the app.
   - Built-in recipes: "image" is a local file in public/images/
   - TheMealDB recipes (later): "image" is the photo web address
   The frame (size and crop) is set in CSS, so every photo is
   cropped the same way. The drawn dish always sits underneath.
   The photo fades in only after it has really loaded. If it is
   missing or fails, the drawing simply stays.
   ============================================================ */
export default function Photo({ recipe, onStatus }) {
  const [status, setStatus] = useState('waiting');
  const src = imageUrl(recipe.image);

  useEffect(() => {
    if (onStatus) onStatus(src ? status : 'none');
  }, [status, src, onStatus]);

  return (
    <>
      <FoodArt recipe={recipe} />
      {src && status !== 'failed' ? (
        <img src={src} alt={'Photo of ' + recipe.name} loading="lazy" decoding="async"
          style={{ opacity: status === 'ok' ? 1 : 0 }}
          onLoad={() => setStatus('ok')} onError={() => setStatus('failed')} />
      ) : null}
    </>
  );
}
