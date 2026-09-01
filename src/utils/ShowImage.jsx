import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const ShowImage = ({ showImageViewer, setShowImageViewer, Info }) => {
  useEffect(() => {
    if (showImageViewer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => (document.body.style.overflow = "auto");
  }, [showImageViewer]);
  return (
    <>
      {showImageViewer &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setShowImageViewer(false)}
          >
            <button
              type="button"
              className="absolute top-5 right-5 h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
              onClick={() => setShowImageViewer(false)}
            >
              <FontAwesomeIcon icon={faX} />
            </button>

            <img
              src={Info?.photo || Info}
              alt={Info.name || "post"}
              className="max-h-[70vh] max-w-[80-vw] sm:max-h-[90vh] sm:max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </>
  );
};

export default ShowImage;
