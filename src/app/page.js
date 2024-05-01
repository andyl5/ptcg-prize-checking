'use client'

import { useEffect, useState, useRef } from "react";
import { fetchData, indexDeck, startGame, checkGuess, resetGame } from "./utils/utils";
import ImportDeck from "./ui/ImportDeck";
import PrizeCards from "./ui/PrizeCards";
import HandCards from "./ui/HandCards";
import DeckCards from "./ui/DeckCards";
import Timer from "./ui/Timer";
import SearchBox from "./ui/SearchBox";

export default function Home() {

  // user imported deck
  const [inputDeck, setInputDeck] = useState('');
  
  const [initialDeck, setInitialDeck] = useState([]);
  const [cardMap, setCardMap] = useState([]);
  
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [prizes, setPrizes] = useState([]);
  
  const [selectedCards, setSelectedCards] = useState([]);
  const [uniqueIndex, setUniqueIndex] = useState(0);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchBoxRef = useRef(null);

  const [isGuessCorrect, setIsGuessCorrect] = useState(null)
  const [blurDecklist, setBlurDecklist] = useState(false)
  
  const handleToggleCard = (card) => {
    if (selectedCards.length < 6) {
      const newSelectedCard = {...card, 'index': uniqueIndex};
      setUniqueIndex(uniqueIndex => uniqueIndex + 1);
      setSelectedCards([...selectedCards, newSelectedCard]);
    }
  };

  const handleRemoveCard = (indexToRemove) => {
    setSelectedCards(selectedCards =>
      selectedCards.filter((_, index) => index !== indexToRemove)
    );
  };

  useEffect(() => {
    indexDeck(cardMap, setInitialDeck);    
  }, [cardMap]);

  useEffect(() => {
    setDeck(initialDeck);
  }, [initialDeck]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="m-0 p-0">
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {/* <Timer/> */}
      </div>

      <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 ">
        <div ref={searchBoxRef}>
          <SearchBox 
            cards={cardMap} 
            selectedCards={selectedCards} 
            handleToggleCard={handleToggleCard} 
            handleRemoveCard={handleRemoveCard} 
            isSearchOpen={isSearchOpen} 
            setIsSearchOpen={setIsSearchOpen}
          />
        </div>
        <p className={`${isGuessCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {isGuessCorrect === null ? '' : isGuessCorrect ? 'CORRECT' : 'WRONG'}
          </p>
      </div>

      <div className="absolute left-0">
        <PrizeCards cards={prizes}/>
      </div>

      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <HandCards cards={hand} />
      </div>

      <div className="absolute right-0">
        <ImportDeck setInputDeck={setInputDeck} blurDecklist={blurDecklist}/>
        <button 
            disabled={isLoading ? true : false}
            className="border bg-stone-400 block w-full p-2 rounded " 
            onClick={() => fetchData(inputDeck, setCardMap, setIsLoading)}>
                {isLoading ? 'PLEASE WAIT' : 'IMPORT DECK'}
        </button>
        <button 
          onClick={() => setBlurDecklist(!blurDecklist)}
          className="border bg-stone-400 block w-full p-2 rounded disabled:bg-stone-400/50" 
          disabled={initialDeck.length === 0 ? true : false}
          >
          {blurDecklist ? 'SHOW DECKLIST': 'BLUR DECKLIST'}
        </button>
        <button 
          onClick={() => {
            resetGame(initialDeck, setDeck, setHand, setPrizes, setSelectedCards, setIsGuessCorrect)
            startGame(initialDeck, setDeck, setHand, setPrizes)
          }}
          className="border bg-stone-400 block w-full p-2 rounded disabled:bg-stone-400/50" 
          disabled={initialDeck.length === 0 ? true : false}
        >START GAME</button>
        <button 
          className="border bg-stone-400 block w-full p-2 rounded disabled:bg-stone-400/50" 
          onClick={() => checkGuess(prizes, selectedCards, setIsGuessCorrect)}
          disabled={selectedCards.length === 0 ? true : false}
        >CHECK GUESS</button>
      </div>

      <div className="absolute left-0 bottom-0">
        <DeckCards cards={deck}/>
      </div>
    </div>
  );
}
