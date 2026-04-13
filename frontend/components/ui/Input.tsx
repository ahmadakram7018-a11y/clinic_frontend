import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label className="text-sm font-medium text-text-primary ml-1">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          className={cn(
            "flex w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-status-danger focus:ring-status-danger/20 focus:border-status-danger" : "",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-status-danger ml-1">{error}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
