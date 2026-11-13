import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FileInputProps = Omit<React.ComponentProps<"input">, "type">;

/**
 * Native file picker styled to match the other inputs. Files are uploaded
 * straight to Cloudinary from the browser (US-11), never to our server.
 */
export function FileInput({ className, ...props }: FileInputProps) {
  return (
    <Input
      type="file"
      className={cn(
        "h-auto py-2 file:mr-3 file:h-8 file:rounded-md file:bg-ink file:px-3 file:text-paper hover:file:bg-ink-soft",
        className,
      )}
      {...props}
    />
  );
}
