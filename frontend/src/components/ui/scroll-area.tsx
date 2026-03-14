import * as React from "react";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { maxHeight?: string }
>(({ className, children, maxHeight, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-h-0 overflow-y-auto overflow-x-hidden", className)}
    style={{
      ...style,
      ...(maxHeight ? { maxHeight } : {}),
    }}
    {...props}
  >
    {children}
  </div>
));
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
