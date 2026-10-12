"use client";

import dynamic from "next/dynamic";

const HelixScene = dynamic(() => import("./helix-scene"), { ssr: false });

// Een doorzichtige laag over de hele pagina, onder de menubalk; klikken gaan er dwars doorheen.
export function Helix() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      <HelixScene />
    </div>
  );
}
