export default function HandCards( { cards } ) {

	return (
		<div className="">
			<div className="flex gap-1 border">
				{cards.map(card => (
					<div key={card.index} className="hover:scale-150 hover:mx-6 hover:-translate-y-5 hover:z-10 transition-all " >
						<img className="" src={card.images.small} draggable={false} alt=""/>
					</div>
				))}
			</div>
		</div>
	)
}