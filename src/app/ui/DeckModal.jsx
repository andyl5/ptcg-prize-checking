export default function DeckModal({ isOpen, onClose, children }) {

	if (!isOpen) return null;

	return (
		<div className="fixed z-10 inset-0">
			<div className="flex items-center justify-center min-h-screen px-4">
				<div className="fixed inset-0 transition-opacity" onClick={onClose}>
					<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
				<div className="z-20 bg-white rounded-lg shadow-xl p-6 w-[80vw] h-full overflow-y-auto">
					{children}
				</div>
			</div>
		</div>
	)
}