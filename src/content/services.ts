/**
 * Services offered. Used by the home page cards (featured services) and the
 * /services page (all services). Wording is a draft for client review.
 */
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Clock,
  DoorOpen,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

export type Service = {
  /** Anchor id on /services, e.g. /services#same-day */
  id: string;
  title: string;
  /** One or two sentences for cards. */
  description: string;
  /** Longer copy for the /services page. */
  details: string;
  /** Key points shown as a checklist on /services. */
  points: string[];
  icon: LucideIcon;
  /** Shown on the home page. */
  featured: boolean;
};

export const services: Service[] = [
  {
    id: "door-to-door",
    title: "Door-to-door delivery",
    description:
      "We collect your vehicle from one address and drive it directly to the next, with no depots and no waiting around.",
    details:
      "A driver collects your vehicle from the address you choose, whether that's a home, a dealership or a workplace, and drives it straight to its destination. There are no depots or transfers along the way, so your vehicle spends less time on the road and you always know where it is.",
    points: [
      "Collection from any address you choose",
      "Driven directly to the destination",
      "Condition checked at collection and handover",
    ],
    icon: DoorOpen,
    featured: true,
  },
  {
    id: "same-day",
    title: "Same-day delivery",
    description:
      "Need it moved today? Book early and a driver can collect and deliver your vehicle on the same day.",
    details:
      "When timing matters, we can collect and deliver on the same day, subject to distance and driver availability. Get in touch as early as possible and we'll confirm what's achievable before you book.",
    points: [
      "Ideal for urgent sales, swaps and repairs",
      "Availability confirmed before you book",
      "Updates on the day",
    ],
    icon: Clock,
    featured: true,
  },
  {
    id: "insured",
    title: "Insured transport",
    description:
      "Your vehicle is driven by a professional driver with suitable insurance cover in place for the journey.",
    details:
      "Every movement is carried out by a professional driver with insurance cover in place for the journey. Cover details are confirmed with your quote, so you know exactly where you stand before your vehicle is collected.",
    points: [
      "Professional, vetted drivers",
      "Cover details confirmed with your quote",
      "Condition recorded at collection and delivery",
    ],
    icon: ShieldCheck,
    featured: false,
  },
  {
    id: "nationwide",
    title: "Nationwide coverage",
    description:
      "From city centres to rural addresses, we move vehicles the length and breadth of the country.",
    details:
      "We move vehicles between towns and cities right across the country, including rural addresses that other services may not reach. Short local moves and long-distance journeys are both welcome.",
    points: [
      "Local and long-distance journeys",
      "City, town and rural addresses",
      "One point of contact for the whole move",
    ],
    icon: MapPinned,
    featured: true,
  },
  {
    id: "trade",
    title: "Trade & dealer",
    description:
      "Reliable, repeatable vehicle movements for dealerships, leasing companies, auctions and fleets.",
    details:
      "We support dealerships, leasing and rental companies, auction houses and fleet operators with dependable vehicle movements, from a single customer delivery to regular collections and returns.",
    points: [
      "Customer deliveries and part-exchange collections",
      "Auction and inter-branch transfers",
      "Regular or one-off bookings",
    ],
    icon: Building2,
    featured: true,
  },
];

export const featuredServices = services.filter((s) => s.featured);

export const serviceHref = (s: Service) => `/services#${s.id}`;

/** FAQ shown on /services. Draft answers for client review. */
export const faqs: { question: string; answer: string }[] = [
  {
    question: "How do I get a quote?",
    answer:
      "Use the Get a Free Quote form with the vehicle details and the collection and delivery addresses. We'll reply with a clear price. You can also call us or send a WhatsApp message.",
  },
  {
    question: "How is the price worked out?",
    answer:
      "The price depends mainly on the distance, the type of vehicle and how soon you need it moved. Your quote is confirmed before anything is booked, with no obligation.",
  },
  {
    question: "Do I need to be there at collection and delivery?",
    answer:
      "Someone needs to hand over the keys at collection and receive the vehicle at delivery. It doesn't have to be you, as long as you let us know who it will be.",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "We collect and deliver across the country, including rural addresses. If you're unsure about a particular location, ask us when you request your quote.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "As early as you can, especially for a specific date. Same-day moves are sometimes possible; contact us and we'll confirm availability.",
  },
  {
    question: "What should I do before my vehicle is collected?",
    answer:
      "Remove personal belongings, make sure there is enough fuel or charge for the journey, and have the keys and any relevant documents ready for the driver.",
  },
];
