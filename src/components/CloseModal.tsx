"use client";

import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { useEffect, useState } from "react";
import { getSearchParam } from "@/lib/utils";

const CloseModal = () => {
  const [callback, setCallback] = useState("/");
  useEffect(() => {
    window.location.pathname;
    window.location.search;
    let callbackURL = getSearchParam(window.location.search, "callbackUrl");
    if (callbackURL?.startsWith("http")) callbackURL = "/";
    console.log(callbackURL);
    if (callbackURL === null) callbackURL = "/";
    console.log(callbackURL);
    setCallback(callbackURL);
  }, []);

  return (
    <Button
      variant="subtle"
      className="h-6 w-6 rounded-md p-0"
      onClick={() => {
        callback;
        // window.location.href = callback
        window.location.assign(callback);
      }}
    >
      <X aria-label="close modal" className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
