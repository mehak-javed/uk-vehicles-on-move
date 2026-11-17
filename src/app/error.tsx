"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusScreen } from "@/components/site/status-screen";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      eyebrow="Something went wrong"
      title="We hit a bump in the road"
      description="Sorry, this page could not be loaded. Please try again, or come back in a few minutes."
    >
      <Button variant="accent" size="lg" onClick={() => retry()}>
        Try again
      </Button>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper"
      >
        <Link href="/">Back to home</Link>
      </Button>
    </StatusScreen>
  );
}
