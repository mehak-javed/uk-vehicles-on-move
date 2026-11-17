import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/site/status-screen";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <StatusScreen
      eyebrow="Error 404"
      title="This page has taken a wrong turn"
      description="The page you are looking for has moved or no longer exists. Let us get you back on the road."
    >
      <Button asChild variant="accent" size="lg">
        <Link href="/">Back to home</Link>
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper"
      >
        <Link href="/contact">Contact us</Link>
      </Button>
    </StatusScreen>
  );
}
