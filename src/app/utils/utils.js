import { ptcgSets } from "./sets";

const pokemonString = "Pokémon"

export async function fetchData(
  inputDeck,
  setCardMap,
  setIsLoading,

) {
  setIsLoading(true);
  let deckArray = parseDeckList(inputDeck);

  const apiParams = deckArray.map(card => 'id:' + card['api']['params']).join(' OR ');
  const apiEndpoint = `https://api.pokemontcg.io/v2/cards?q=(${apiParams})&select=id,name,supertype,subtypes,images,set`;

  fetch(apiEndpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error("something's gone wrong");
      }
      return response.json();
    })
    .then(data => {
      const apiData = data.data;
      deckArray.forEach((card) => {
        const apiCardData = apiData.find((apiCard) => apiCard.id === card['api']['params']);
        card['id'] = apiCardData.id;
        card['name'] = apiCardData.name
        card['supertype'] = apiCardData.supertype;
        card['subtypes'] = apiCardData.subtypes;
        card['images'] = apiCardData.images;
        card['set'] = apiCardData.set;
        delete card['api'];
      });
      createCardMap(deckArray, setCardMap);
      setIsLoading(false);
    })
    .catch(error => {
      setIsLoading(false);
      console.error('Error', error);
    });
};

export const parseDeckList = (deckList) => {

  let filteredLines = deckList.split("\n").filter(line => line[0] >= '0' && line[0] <= '9');

  let arr = [];
  filteredLines.forEach((card) => {
    let parsedCard = card.split(" ");
    const set = parsedCard.at(-2);
    const id = parsedCard.at(-1);
    const name = parsedCard.slice(1, -2).join(' ');
    const count = parsedCard.at(0);
    const apiSetId = ptcgSets.filter((s) => s.ptcgoCode === set)[0]['id']
    
    const cardObject = {
      set,
      id,
      name,
      count,
      api: {
        apiSetId,
        params: apiSetId + "-" + id,
      },
    };
    arr.push(cardObject);
  });
  return arr
}

export const createCardMap = (deckData, setCardMap) => {
  let cardMap = [];
  deckData.forEach(card => {
    let cardObj = {
      id: card.id,
      name: card.name,
      images: card.images,
      count: parseInt(card.count),
      supertype: card.supertype,
      subtypes: card.subtypes,
      set: card.set,
    }
    cardMap.push(cardObj)
  });
  setCardMap(cardMap);
};

export const indexDeck = (cardMap, setInitialDeck) => {
  let index = 1

  let deck = cardMap.map((card) => {
    const modifiedCards = []
    for (let i=0; i<card.count; i++) {
      let modifiedCard = {
        index: index++,
        ...card,
      }
      delete modifiedCard.count
      modifiedCards.push(modifiedCard)
    }
    return modifiedCards.flat()
  }).flat()
  setInitialDeck(deck)
}

export const drawXCards = (deck, hand, x) => {
  let newHand = [...hand]
  // let newDeck = [...deck]
  
  
  for (let i=0; i<x; i++) {
    let drawnCard = deck.shift()
    newHand.push(drawnCard)
  }
  return newHand
}

export const resetDeck = (deck) => {
  return [...deck]
}

export const shuffle = (array) => {
  let m = array.length, t, i
	while (m) {
		i = Math.floor(Math.random() * m--)

		t = array[m]
		// move selected element to the back of the array
		array[m] = array[i]
		array[i] = t
	}
  return array
}

export const hasBasicPokemon = (hand) => {
  for (const card of hand) {
    if (card.supertype === pokemonString && card.subtypes.includes('Basic')) {
      return true
    }
  }
  return false
}

export const startGame = (initialDeck, setDeck, setHand, setPrizes) => {
  let deck = [...initialDeck]
  let hand = []
  let prizes = []
  if (hasBasicPokemon(initialDeck)) {
    while (!hasBasicPokemon(hand)) {
      deck = [...initialDeck]
      hand = []
      deck = shuffle(deck)
      hand = drawXCards(deck, hand, 7)
    }
    prizes = drawXCards(deck, prizes, 6)
  }
  setDeck(deck)
  setHand(hand)
  setPrizes(prizes)  
}

export const checkGuess = (prizes, selectedCards, setIsGuessCorrect) => {
  let tempPrizes = [...prizes];

  selectedCards.forEach(card => {
    if (tempPrizes.some(prize => prize.id === card.id)) {
      let selectedIndex = tempPrizes.findIndex(prize => prize.id === card.id);
      tempPrizes.splice(selectedIndex, 1);
    }
  });

  const prizesFound = 6 - tempPrizes.length;
  if (prizesFound < 6) {
    // console.log('Missing prizes');
    // console.log(6 - tempPrizes.length, 'prizes found');
    setIsGuessCorrect(false)
  } else {
    // console.log('Nice job! All prizes found');
    setIsGuessCorrect(true)
  }  
};

export const resetGame = (initialDeck, setDeck, setHand, setPrizes, setSelectedCards, setIsGuessCorrect) => {
  setDeck([...initialDeck]);
  setHand([]);
  setPrizes([]);
  setSelectedCards([]);
  setIsGuessCorrect(null)
};