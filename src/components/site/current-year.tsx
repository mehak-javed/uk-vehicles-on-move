import { cacheLife } from "next/cache";

/**
 * The year for the copyright line. Cache Components does not allow a bare
 * `new Date()` during prerender, so the value is cached and refreshed daily.
 */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
