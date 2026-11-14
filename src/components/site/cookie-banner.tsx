"use client";

import { useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { saveConsent, useConsent } from "@/lib/consent";

/**
 * First-visit cookie banner with Accept, Decline and Preferences.
 * Accept and Decline are equally prominent, as UK GDPR guidance requires.
 */
export function CookieBanner() {
  const consent = useConsent();
  const [analytics, setAnalytics] = useState(false);

  // undefined = server render, object = already decided
  if (consent !== null) return null;

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-2xl md:flex-row md:items-center md:gap-6">
        <Cookie
          className="hidden size-8 shrink-0 text-gold-dark md:block"
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col gap-1">
          <h2 className="font-sans text-base font-semibold">
            We value your privacy
          </h2>
          <p className="text-sm text-muted-foreground">
            We use essential cookies to make this site work. With your
            permission we would also like to measure how the site is used.{" "}
            <Link
              href="/cookies"
              className="font-medium text-gold-dark underline underline-offset-4"
            >
              Cookie policy
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:flex-nowrap">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="lg">
                Preferences
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-paper">
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">
                  Cookie preferences
                </DialogTitle>
                <DialogDescription>
                  Choose which cookies we may use. You can change this at any
                  time from the cookie policy page.
                </DialogDescription>
              </DialogHeader>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="consent-necessary">
                      Strictly necessary
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Needed for security, sign-in and forms. Always on.
                    </p>
                  </div>
                  <Switch id="consent-necessary" checked disabled />
                </li>
                <li className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="consent-analytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Helps us understand which pages are useful.
                    </p>
                  </div>
                  <Switch
                    id="consent-analytics"
                    checked={analytics}
                    onCheckedChange={setAnalytics}
                  />
                </li>
              </ul>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => saveConsent({ analytics })}
                  >
                    Save preferences
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="lg"
            onClick={() => saveConsent({ analytics: false })}
          >
            Decline
          </Button>
          <Button size="lg" onClick={() => saveConsent({ analytics: true })}>
            Accept
          </Button>
        </div>
      </div>
    </section>
  );
}
