import { z } from "zod";

/** Validation pieces shared by every form on the site. */

// UK postcode, e.g. "SW1A 1AA", "m1 1ae", "B338TH". Normalised to "B33 8TH".
const UK_POSTCODE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/i;

export const ukPostcode = z
  .string()
  .trim()
  .min(1, "Enter a postcode")
  .regex(UK_POSTCODE, "Enter a valid UK postcode, like SW1A 1AA")
  .transform((v) => v.toUpperCase().replace(UK_POSTCODE, "$1 $2"));

// UK phone: 07…, 01…, 02…, +44… or 0044…, spaces/dashes/brackets allowed.
// Normalised to international format, e.g. "+447700900123".
const isUkPhone = (v: string) =>
  /^(?:(?:\+|00)44|0)[1-9]\d{8,9}$/.test(v.replace(/[\s\-().]/g, ""));
const toE164 = (v: string) =>
  `+44${v.replace(/[\s\-().]/g, "").replace(/^(?:\+44|0044|0)/, "")}`;

export const ukPhone = z
  .string()
  .trim()
  .min(1, "Enter a phone number")
  .refine(isUkPhone, "Enter a valid UK phone number, like 07700 900123")
  .transform(toE164);

/** Same rules, but the field may be left empty. */
export const optionalUkPhone = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || isUkPhone(v),
    "Enter a valid UK phone number, like 07700 900123",
  )
  .transform((v) => (v === "" ? "" : toE164(v)));

export const email = z.email(
  "Enter a valid email address, like name@example.com",
);

export const privacyConsent = z.literal(true, {
  error: "Please confirm you have read the privacy policy",
});

/** Today's date in the UK as YYYY-MM-DD. */
export function todayInUk(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
  }).format(new Date());
}

/* ── File uploads ──────────────────────────────────────────────────────
 * Files are checked in the browser before anything is sent. In the
 * backend stories (US-15, US-16) they are uploaded straight from the
 * browser to Cloudinary as private files; only their details reach our
 * server, so the server validates the same limits on that metadata.
 */

export const MAX_FILE_MB = 5;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export const fileKinds = {
  document: {
    extensions: [".pdf", ".doc", ".docx"],
    label: "PDF or Word",
  },
  documentOrImage: {
    extensions: [".pdf", ".jpg", ".jpeg", ".png"],
    label: "PDF, JPG or PNG",
  },
  image: {
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".heic"],
    label: "JPG, PNG, WebP or HEIC",
  },
} as const;

export type FileKind = keyof typeof fileKinds;

const extensionOf = (name: string) =>
  name.slice(name.lastIndexOf(".")).toLowerCase();

const formatMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

type FileLike = { name: string; size: number };

/** Problems with a set of files, as user-friendly messages. */
function fileProblems(
  files: FileLike[],
  kind: FileKind,
  { required, max }: { required: boolean; max: number },
): string[] {
  const { extensions, label } = fileKinds[kind];
  if (required && files.length === 0) return ["Choose a file to upload"];
  if (files.length > max)
    return [`Choose up to ${max} file${max === 1 ? "" : "s"}`];
  const problems: string[] = [];
  for (const f of files) {
    if (!(extensions as readonly string[]).includes(extensionOf(f.name)))
      problems.push(`${f.name} is not allowed. Upload a ${label} file.`);
    else if (f.size > MAX_FILE_BYTES)
      problems.push(
        `${f.name} is ${formatMb(f.size)}. Files must be ${MAX_FILE_MB} MB or smaller.`,
      );
  }
  return problems;
}

/**
 * Browser-side file field: accepts the FileList from an <input type="file">
 * and returns an array of Files.
 */
export function filesField(
  kind: FileKind,
  opts: { required?: boolean; max?: number } = {},
) {
  const { required = false, max = 1 } = opts;
  return z
    .custom<FileList | File[] | undefined | null>()
    .transform((v): File[] => (v ? Array.from(v as ArrayLike<File>) : []))
    .superRefine((files, ctx) => {
      const [problem] = fileProblems(files, kind, { required, max });
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    });
}

/** Server-side check of the same rules, using file details only. */
export function fileMetaField(
  kind: FileKind,
  opts: { required?: boolean; max?: number } = {},
) {
  const { required = false, max = 1 } = opts;
  return z
    .array(
      z.object({
        name: z.string().max(200),
        size: z.number().int().nonnegative(),
        type: z.string().max(100),
      }),
    )
    .superRefine((files, ctx) => {
      const [problem] = fileProblems(files, kind, { required, max });
      if (problem) ctx.addIssue({ code: "custom", message: problem });
    });
}

/** The `accept` attribute for a file input of this kind. */
export const acceptFor = (kind: FileKind) =>
  fileKinds[kind].extensions.join(",");

/** Strip File objects down to the details the server needs. */
export const toFileMeta = (files: File[]) =>
  files.map(({ name, size, type }) => ({ name, size, type }));
