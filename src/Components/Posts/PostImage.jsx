import React, { useState, useCallback, useMemo } from "react";
import ShowImage from "../../utils/ShowImage";

const PostImage = ({ postImage }) => {
  const [showImageViewer, setShowImageViewer] = useState(false);

  const handleOpen = useCallback(() => setShowImageViewer(true), []);
  const imageInfo = useMemo(() => ({ photo: postImage }), [postImage]);

  if (!postImage) return null;

  return (
    <>
      <div className="max-h-120 overflow-hidden border-y border-slate-200 dark:border-slate-700">
        <button
          onClick={handleOpen}
          type="button"
          className="group relative block w-full cursor-pointer"
        >
          <img
            src={postImage}
            alt="post"
            className=" h-80 sm:h-auto w-full mx-auto object-cover"
          />
          <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
        </button>
      </div>

      <ShowImage
        showImageViewer={showImageViewer}
        setShowImageViewer={setShowImageViewer}
        Info={imageInfo}
      />
    </>
  );
};

export default React.memo(PostImage);