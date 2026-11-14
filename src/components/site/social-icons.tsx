import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";

import { siteConfig, type SocialName } from "@/config/site";
import { cn } from "@/lib/utils";

export { FaWhatsapp as WhatsAppIcon };

const icons: Record<SocialName, IconType> = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  LinkedIn: FaLinkedinIn,
};

/** Social profile links. Renders nothing until at least one URL is configured. */
export function SocialIcons({ className }: { className?: string }) {
  if (siteConfig.social.length === 0) return null;

  return (
    <ul className={cn("flex gap-3", className)}>
      {siteConfig.social.map(({ name, href }) => {
        const Icon = icons[name];
        return (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${siteConfig.name} on ${name} (opens in a new tab)`}
              className="flex size-10 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors hover:border-gold hover:text-gold focus-visible:ring-3 focus-visible:ring-gold/60 focus-visible:outline-none"
            >
              <Icon className="size-4" aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
