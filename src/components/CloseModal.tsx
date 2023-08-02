"use client";

import { X } from "lucide-react";
import { Button } from "./ui/Button";
import { useSearchParams } from 'next/navigation'

const CloseModal = () => {
  const searchParams = useSearchParams()
  const handleClick = () => {
    const params = Object.fromEntries(searchParams.entries())
    let callback = params.callbackUrl
    if (callback?.startsWith("http")) callback = "/";
    if (callback === null) callback = "/";

    // router.push(callback);
      // - using the router.push() doesn't close the intersecting 'sign-in' or 'sign-up'
      // so i decieded to use window.assign
        // josh was using router.back(), it was working for him, but i want differen functionality
    
    window.location.assign(callback)
    
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
