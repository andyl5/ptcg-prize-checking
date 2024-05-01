import { useState, useRef } from "react";
import { createPortal } from "react-dom";

export default function SearchBox({ cards, selectedCards, handleToggleCard, handleRemoveCard, isSearchOpen, setIsSearchOpen }) {
  const [query, setQuery] = useState("");
  const [isHover, setIsHover] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const inputRef = useRef(null);

  const filterCards = query === "" ? [] : cards.filter((card) => {
    return card.name.toLowerCase().includes(query.toLowerCase());
  });

  const handleMouseEnter = (e, card) => {
    setIsHover(true);
    setActiveCard(card);
    // Set the mouse position
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setIsHover(false);
    setActiveCard(null);
  };

  return (
    <div className="relative">

      <div className="flex flex-wrap w-[500px] p-4 `ps-10 text-md border border-gray-600 rounded-lg bg-gray-50 mb-1"
        onClick={() => {
          inputRef.current.focus();
          setIsHover(false);
          }}>

        {selectedCards.map((card, index) => (
          <div key={index} className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 mb-2">
            {card.name}
            <button
                className="ml-2 outline-none focus:outline-none"
                onClick={() => handleRemoveCard(index)}
              >
                &#x2715;
            </button>
        </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          className={'flex-grow ml-2 outline-none bg-gray-50'}
          placeholder={selectedCards.length > 0 ? '' : 'Search for a card...'}
          value={query}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              setActiveCard(null)
            }
            setQuery(e.target.value)
            setIsSearchOpen(true)
          }}
        />
      </div>

      <div className={`overflow-y-auto max-h-[350px] ${filterCards.length > 0 && isSearchOpen ? 'border' : ''} border-gray-500 rounded-lg`}>
        {isSearchOpen && filterCards.map(card => (
          <div
            key={card.id}
            className="px-3 py-1 hover:bg-gray-200 rounded-lg cursor-pointer active:bg-gray-300"
            onMouseEnter={(e) => handleMouseEnter(e, card)}
            onMouseLeave={() => handleMouseLeave()}
            onMouseMove={(e) => {
              setMousePosition({ x: e.clientX, y: e.clientY });
            }}
            onClick={() => {
              handleToggleCard(card)
              setQuery('')
              setIsHover(false)
            }}
          >
            <p className="select-none text-lg inline pr-2">{card.name}</p>
            <img className="inline h-[2em]" src={card.set.images.symbol} alt="" />
          </div>
        ))}
      </div>
      {isHover && activeCard && (
        createPortal(
          <img
            ref={imageRef}
            className="absolute"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
            //   transform: `translate(calc(${imageRef.current ? imageRef.current.naturalWidth / 2 : 0}px * -1), calc(${imageRef.current ? imageRef.current.naturalHeight + 5 : 0}px * -1))`, // Calculate translateY based on image height
              transform: `translate(2px, calc(${imageRef.current ? imageRef.current.naturalHeight + 5 : 0}px * -1))`, // Calculate translateY based on image height
            }}
            src={activeCard.images.small}
            alt=""
            draggable={false}
          />,
          document.body
        )
      )}
    </div>
  );
}
