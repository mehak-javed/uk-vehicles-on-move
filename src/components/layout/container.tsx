import { cn } from "@/lib/utils";

type ContainerProps = React.ComponentProps<"div"> & {
  /** Narrow containers suit long-form text such as legal pages. */
  size?: "default" | "narrow";
};

/** Centres page content with consistent side gutters and max width. */
export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "narrow" ? "max-w-3xl" : "max-w-7xl",
        className,
      )}
      {...props}
    />
  );
}
