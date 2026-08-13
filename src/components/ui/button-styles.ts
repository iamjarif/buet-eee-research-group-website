import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "default" | "sm";

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-text-inverse hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
  secondary:
    "bg-surface-subtle text-text-primary hover:brightness-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
  ghost:
    "bg-transparent text-text-primary hover:bg-surface-subtle/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
};

export const sizeClasses: Record<ButtonSize, string> = {
  default: "px-[var(--spacing-button-x)] py-[var(--spacing-button-y)] text-label-md font-medium",
  sm: "px-4 py-2 text-[length:var(--text-label-xs-size)] leading-[var(--text-label-xs-line)] font-medium",
};

export const baseClasses =
  "inline-flex items-center justify-center gap-1.5 font-medium transition-[transform,filter,background-color] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] disabled:pointer-events-none disabled:opacity-50";

export function getButtonClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
) {
  return cn(baseClasses, sizeClasses[size], className, variantClasses[variant]);
}
