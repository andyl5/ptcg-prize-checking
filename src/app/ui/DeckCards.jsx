import { useState } from "react";
import DeckModal from "./DeckModal"

export default function DeckCards( { cards } ) {
	const cardback = 'https://images.pokemontcg.io/'

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<div>
			<div className="flex items-center justify-center cursor-pointer" onClick={openModal}>
				<img className="" src={cardback} draggable={false} height="160" width="120" alt="" />
				<button className="absolute bg-white rounded-lg text-black `text-center px-2 py-1">View Deck</button>
			</div>
			<DeckModal isOpen={isOpen} onClose={closeModal}>
				<div className="relative">
					<button onClick={closeModal} type="button" className="absolute top-0 right-0 bg-white rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
						<span className="sr-only">Close menu</span>
						<svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<h1 className="text-2xl font-bold mb-4 text-center">{`Deck (${cards.length})`}</h1>
				<div className="flex overflow-x-auto gap-x-3">
					{cards.map(card => (
						<div key={card.index} className="flex-none mt-2 hover:-translate-y-2 transition-all">
							<img className="" src={card.images.small} alt={card.id} draggable={false}/>
						</div>
					))}
				</div>
			</DeckModal>
		</div>
	)
}