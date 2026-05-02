import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Loading = () => {
  return (
    <div className="absolute z-50 inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.7)]">
      <p className="bg-white rounded-3xl p-3    font-semibold">
        {" "}
        <FontAwesomeIcon icon={faSpinner} spin className=" text-blue-600 me-1" />
        Refreshing Your Timeline...
      </p>
    </div>
  );
};

export default Loading;
