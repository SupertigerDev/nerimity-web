export function cn(
  ...args: Array<string | undefined | null | number | false>
): string {
  return args.filter(Boolean).join(" ");
}
