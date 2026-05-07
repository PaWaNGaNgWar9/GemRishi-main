import React from "react";

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50"
			onClick={onClose} /* closing when click outside */ >
			<div className="bg-white rounded-xl overflow-hidden shadow-lg relative max-w-md w-full"
				onClick={(e) => e.stopPropagation()} /*added this to prevent close if clicked inside div  */>
				{/* Close Button */}
				<button
					className="absolute top-2 right-2 text-white hover:bg-red-700 text-lg w-8 h-8  bg-red-600 rounded-full curs text-2xl z-100 cursor cursor-pointer"
					onClick={onClose}>
					✕
				</button>

				{/* Video */}
				<video
					src={videoUrl}
					controls
					autoPlay
					className="w-full h-[40vh] object-contain"
				/>
			</div>
		</div>
	);
};

export default VideoModal;
