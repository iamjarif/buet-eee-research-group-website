import Link from "next/link";

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface-inverse focus:px-4 focus:py-2 focus:text-text-inverse"
    >
      Skip to main content
    </Link>
  );
}

export default SkipLink;
