/** Whether a main-nav href matches the current route (including nested pages). */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (!href || href.startsWith("http")) return false;

  const [pathWithoutHash] = pathname.split("#");
  const [hrefWithoutHash] = href.split("#");

  const normalizedPath =
    pathWithoutHash.replace(/\/+$/, "") || "/";
  const normalizedHref =
    hrefWithoutHash.replace(/\/+$/, "") || "/";

  if (normalizedHref === "/") {
    return normalizedPath === "/";
  }

  return (
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(`${normalizedHref}/`)
  );
}
