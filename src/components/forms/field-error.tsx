import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type FieldErrorProps = {
  /** Must match the input's aria-describedby so screen readers announce it. */
  id: string;
  message?: string;
  className?: string;
};

/** Validation message shown under a form field. Renders nothing when valid. */
export function FieldError({ id, message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "flex items-center gap-1.5 text-sm text-destructive",
        className,
      )}
    >
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
