import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Small label above the title, e.g. "Our services". */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  /** Use "dark" when the section sits on a black background. */
  tone?: "light" | "dark";
  /** Heading level; defaults to h2 because each page has one h1. */
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-3",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold tracking-[0.2em] uppercase",
            // gold-dark on light (5.9:1), gold on dark (8.1:1) — both pass AA
            tone === "dark" ? "text-gold" : "text-gold-dark",
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "text-3xl font-semibold text-balance sm:text-4xl",
          tone === "dark" ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "text-lg text-pretty",
            tone === "dark" ? "text-grey-400" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
