export default function ImportDeck( { setInputDeck, blurDecklist } ) {
	return (
		<div className="w-[20vw] border-2 border-black">
			<textarea 
				className={`resize-none w-full h-[80vh] px-2 ${blurDecklist ? 'blur' : ''}`}
				onChange={(e) => setInputDeck(e.target.value)}
				placeholder="Import decklist"></textarea>
		</div>
	)
}