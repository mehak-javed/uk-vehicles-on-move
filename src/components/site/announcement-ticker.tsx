import { siteConfig } from "@/config/site";

/**
 * Scrolling gold announcement strip. The list is rendered twice so the
 * loop is seamless; the copy is hidden from screen readers. Motion stops
 * on hover/focus and for visitors who prefer reduced motion.
 */
export function AnnouncementTicker() {
  const messages = siteConfig.announcements;
  if (messages.length === 0) return null;

  const items = (hidden: boolean) => (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={hidden || undefined}
    >
      {messages.map((message) => (
        <li
          key={message}
          className="flex items-center gap-12 whitespace-nowrap"
        >
          <span aria-hidden="true" className="text-xs">
            ◆
          </span>
          {message}
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label="Announcements"
      className="group overflow-hidden bg-gold py-2 text-sm font-medium text-ink"
    >
      <div className="flex w-max animate-ticker group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items(false)}
        {items(true)}
      </div>
    </section>
  );
}
