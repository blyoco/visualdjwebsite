"use client";

import dynamic from "next/dynamic";

const StarScene = dynamic(() => import("./star-scene"), { ssr: false });

// Een doorzichtige laag met sterrenpixels over de hele pagina, onder de menubalk; klikken gaan er dwars doorheen.
// (De pixelslangen staan voorlopig uit: de gebruiker vond ze te druk. Ze staan nog in snake-scene.tsx.)
export function Stars() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      <StarScene />
    </div>
  );
}
