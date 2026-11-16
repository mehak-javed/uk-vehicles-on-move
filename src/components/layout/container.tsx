import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  /** Narrow containers suit long-form text such as legal pages. */
  size?: "default" | "narrow";
};

/** Page content with consistent side gutters, using nearly the full width. */
export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16",
        // Full width on most screens; capped only on very wide monitors
        size === "narrow" ? "max-w-3xl" : "max-w-[1760px]",
        className,
      )}
      {...props}
    />
  );
}
