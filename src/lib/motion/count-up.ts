export type ParsedCountValue = {
  prefix: string;
  target: number;
  suffix: string;
};

const COUNT_PATTERN = /^(\D*)(\d+(?:\.\d+)?)(\D*)$/;

export function parseCountValue(value: string): ParsedCountValue | null {
  const trimmed = value.trim();
  const match = trimmed.match(COUNT_PATTERN);

  if (!match) return null;

  const [, prefix = "", numeric = "", suffix = ""] = match;
  const target = Number(numeric);

  if (!Number.isFinite(target) || target <= 0) return null;

  return {
    prefix,
    target,
    suffix,
  };
}

export function formatCountValue(parsed: ParsedCountValue, current: number): string {
  const rounded =
    parsed.target % 1 === 0 ? Math.round(current).toString() : current.toFixed(1);

  return `${parsed.prefix}${rounded}${parsed.suffix}`;
}
