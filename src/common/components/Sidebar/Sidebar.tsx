import * as React from "react";
import { cn } from "@/common/utils/css";

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-full flex-col overflow-y-auto bg-sidebar text-sidebar-foreground shadow-sm", className)}
      {...props}
    >
      {children}
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex h-14 items-center border-b border-sidebar-border px-4", className)} {...props}>
        {children}
      </div>
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 overflow-y-auto py-2", className)} {...props}>
        {children}
      </div>
    );
  }
);
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center border-t border-sidebar-border p-4", className)} {...props}>
        {children}
      </div>
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarTrigger = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { title: string; defaultOpen?: boolean }
>(({ className, title, defaultOpen = false, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div ref={ref} className={cn("py-2", className)} {...props}>
      <button
        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium text-white hover:bg-slate-600/50 dark:hover:bg-slate-700/50 rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("h-4 w-4 transition-transform", {
            "transform rotate-180": isOpen,
          })}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && <div className="mt-1 px-2">{children}</div>}
    </div>
  );
});
SidebarGroup.displayName = "SidebarGroup";

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger, SidebarGroup };
