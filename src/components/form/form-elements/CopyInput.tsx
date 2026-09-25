"use client";

import type React from "react";
import { useState } from "react";
import { Copy as IconCopy } from "lucide-react";

const CopyInput: React.FC = () => {
  const [website, setWebsite] = useState("www.tailadmin.com");
  const [copyText, setCopyText] = useState("Copy");

  const copyWebsite = () => {
    navigator.clipboard.writeText(website).then(() => {
      setCopyText("Copied!");
      setTimeout(() => setCopyText("Copy"), 2000);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={copyWebsite}
        className="absolute end-0 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 border-s border-line py-3 ps-3.5 pe-3 text-fx-15 font-medium text-ink"
      >
        <IconCopy size={20} />
        <div>{copyText}</div>
      </button>
      <input
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        type="url"
        className="h-11 w-full rounded-field border border-line bg-transparent py-3 ps-4 pe-[90px] text-fx-15 text-ink placeholder:text-muted focus:border-line focus:outline-hidden focus:ring-3 focus:ring-dark/10"
        placeholder="Enter website URL"
      />
    </div>
  );
};

export default CopyInput;
