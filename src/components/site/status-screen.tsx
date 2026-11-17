import { Container } from "@/components/layout/container";

type StatusScreenProps = {
  /** Small gold label above the title, e.g. "Error 404". */
  eyebrow: string;
  title: string;
  description: string;
  /** Buttons and links shown under the text. */
  children: React.ReactNode;
};

/** Full-height dark screen used by the 404 and error pages. */
export function StatusScreen({
  eyebrow,
  title,
  description,
  children,
}: StatusScreenProps) {
  return (
    // Pulled up under the transparent header (h-20) so the dark area shows behind it
    <section
      data-header-dark
      className="-mt-20 flex min-h-[80svh] items-center bg-ink pt-20 text-paper"
    >
      <Container className="flex flex-col gap-5 py-20">
        <p className="text-sm font-semibold tracking-[0.2em] text-gold uppercase">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold text-balance sm:text-6xl">
          {title}
        </h1>
        <p className="max-w-xl text-lg text-pretty text-grey-400">
          {description}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">{children}</div>
      </Container>
    </section>
  );
}
