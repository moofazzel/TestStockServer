"use client";

import Copy from "@/icons/Copy";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

function CopyClipboard({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleOnClick = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <div className="relative flex items-center">
        <CopyToClipboard text={text}>
          <button onClick={() => handleOnClick()}>
            <Copy />
          </button>
        </CopyToClipboard>

        <div className={isCopied ? "block" : "hidden"}>
          <div className="absolute text-center transition-all -top-10 -right-3 text-white  bg-green-500 rounded  font-semibold text-lg px-1 py-0.5">
            <div className="relative inline-block">
              <div className="tooltip">
                <span className="tooltiptext">Copied!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CopyClipboard;
