import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, icon, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium tracking-wide text-text-dim uppercase"
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative flex items-center rounded-2xl border bg-white/[0.03] transition-colors",
          error ? "border-red-500/60" : "border-white/10 focus-within:border-white/30",
        )}
      >
        {icon && (
          <span className="pl-4 text-text-muted pointer-events-none">{icon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex-1 bg-transparent py-3.5 px-4 text-[0.95rem] text-text placeholder:text-text-muted outline-none",
            icon && "pl-3",
            className,
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
});
