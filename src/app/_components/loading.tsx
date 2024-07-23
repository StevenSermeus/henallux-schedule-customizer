import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
export const Loading = ({
  className,
  size,
}: {
  className?: string;
  size: number;
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 className="animate-spin" size={size} color="gray" />
    </div>
  );
};
