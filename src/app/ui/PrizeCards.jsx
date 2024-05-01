import { useState } from "react";

export default function PrizeCards({ cards }) {
  const cardback = 'https://images.pokemontcg.io/';
  const [revealedIndices, setRevealedIndices] = useState([]);

  const toggleReveal = (index) => {
    if (revealedIndices.includes(index)) {
      setRevealedIndices(revealedIndices.filter(i => i !== index));
    } else {
      setRevealedIndices([...revealedIndices, index]);
    }
  };

  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-1">
      {cards.map((card, index) => (
        <div key={index} className="">
          <img
            className="inline h-[175px]"
            src={revealedIndices.includes(index) ? card.images.small : cardback}
            onClick={() => toggleReveal(index)}
            draggable={false}
            alt=""
          />
        </div>
      ))}
    </div>
  );
}
