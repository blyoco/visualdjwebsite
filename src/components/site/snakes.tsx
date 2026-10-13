"use client";

import dynamic from "next/dynamic";

const SnakeScene = dynamic(() => import("./snake-scene"), { ssr: false });

// Een doorzichtige laag over de hele pagina, onder de menubalk; klikken gaan er dwars doorheen.
export function Snakes() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40">
      <SnakeScene />
    </div>
  );
}
