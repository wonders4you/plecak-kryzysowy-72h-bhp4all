import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-paper-2",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-forest transition-[width] duration-300 ease-out",
          barClassName,
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
