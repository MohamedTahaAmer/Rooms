"use client";

import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { getSearchParam } from "@/lib/utils";

const CloseModal = () => {
  const handleClick = () => {
    let callbackURL = getSearchParam(window.location.search, "callbackUrl");
    if (callbackURL?.startsWith("http")) callbackURL = "/";
    if (callbackURL === null) callbackURL = "/";

    // router.push(callbackURL);
      // - using the router.push() doesn't close the intersecting 'sign-in' or 'sign-up'
        // josh was using router.back(), it was working for him, but i want differen functionality
          // so i decieded to use window.assign
    
    window.location.assign(callbackURL)
    
  };

  return (
    <Button
      variant="subtle"
      className="h-6 w-6 rounded-md p-0"
      onClick={handleClick}
    >
      <X aria-label="close modal" className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
