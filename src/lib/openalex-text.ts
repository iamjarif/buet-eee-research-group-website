import { decode } from "html-entities";

const HTML_TAG_PATTERN = /<\/?[a-zA-Z][^>]*>/g;

const MATH_WRAPPER_TAGS = ["tex-math", "inline-formula", "inline-tex", "math", "mml:math"];

/** Longer LaTeX commands first so \\leq wins over \\le. */
const LATEX_SYMBOLS: Array<[string, string]> = [
  ["leftrightarrow", "↔"],
  ["rightarrow", "→"],
  ["leftarrow", "←"],
  ["infty", "∞"],
  ["approx", "≈"],
  ["times", "×"],
  ["cdot", "·"],
  ["circ", "°"],
  ["degree", "°"],
  ["Omega", "Ω"],
  ["omega", "ω"],
  ["Delta", "Δ"],
  ["delta", "δ"],
  ["Gamma", "Γ"],
  ["gamma", "γ"],
  ["Theta", "Θ"],
  ["theta", "θ"],
  ["Lambda", "Λ"],
  ["lambda", "λ"],
  ["Sigma", "Σ"],
  ["sigma", "σ"],
  ["Phi", "Φ"],
  ["phi", "φ"],
  ["alpha", "α"],
  ["beta", "β"],
  ["epsilon", "ε"],
  ["micro", "µ"],
  ["mu", "µ"],
  ["pi", "π"],
  ["neq", "≠"],
  ["leq", "≤"],
  ["geq", "≥"],
  ["ne", "≠"],
  ["le", "≤"],
  ["ge", "≥"],
  ["pm", "±"],
  ["mp", "∓"],
];

const SUPERSCRIPT_CHARS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "-": "⁻",
  "=": "⁼",
};

function decodeEntities(value: string): string {
  let text = value;
  for (let i = 0; i < 3; i += 1) {
    const decoded = decode(text);
    if (decoded === text) break;
    text = decoded;
  }
  return text;
}

function applyLatexSymbols(text: string): string {
  let result = text.replace(/\\[,;:!]/g, " ");
  result = result.replace(/\\+/g, "\\");

  for (const [command, symbol] of LATEX_SYMBOLS) {
    result = result.replace(new RegExp(`\\\\${command}\\b`, "g"), symbol);
  }

  result = result.replace(/\\[a-zA-Z]+\*?/g, "");
  result = result.replace(/\\/g, "");
  result = result.replace(/\s*·\s*/g, "·");
  return result;
}

function latexToPlain(latex: string): string {
  let text = applyLatexSymbols(latex.replace(/\$/g, " "));
  text = text.replace(/[{}~^_]/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

function replacePairedTags(
  html: string,
  tagName: string,
  replaceInner: (inner: string) => string,
): string {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}\\s*>`, "gi");
  return html.replace(pattern, (_match, inner: string) => replaceInner(inner));
}

function toSuperscript(inner: string): string {
  const trimmed = inner.trim();
  if (!trimmed) return "";
  if ([...trimmed].every((char) => char in SUPERSCRIPT_CHARS)) {
    return [...trimmed].map((char) => SUPERSCRIPT_CHARS[char]).join("");
  }
  return trimmed;
}

/**
 * Decode HTML entities and strip tags from OpenAlex plain-text fields.
 * Math wrappers (<tex-math>, <inline-formula>, …) are converted to Unicode
 * instead of leaving raw LaTeX. Remaining tags keep inner text.
 */
export function cleanOpenAlexText(value?: string | null): string {
  if (!value) return "";

  let text = decodeEntities(value);

  for (const tag of MATH_WRAPPER_TAGS) {
    text = replacePairedTags(text, tag, (inner) => {
      const converted = latexToPlain(inner);
      return converted ? ` ${converted} ` : " ";
    });
  }

  text = replacePairedTags(text, "sup", (inner) => toSuperscript(inner));
  text = replacePairedTags(text, "sub", (inner) => inner.trim());
  text = replacePairedTags(text, "inf", (inner) => inner.trim());
  for (const tag of ["i", "em", "b", "strong"]) {
    text = replacePairedTags(text, tag, (inner) => inner);
  }

  text = text.replace(HTML_TAG_PATTERN, " ");
  text = text.replace(/\$([^$]*)\$/g, (_match, inner: string) => {
    const converted = latexToPlain(inner);
    return converted ? ` ${converted} ` : " ";
  });
  text = applyLatexSymbols(text);
  text = text.replace(/\$/g, "");
  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼])([A-Za-z])/g, "$1 $2");
  text = text.replace(/([0-9])([A-Z][a-z]{2,})/g, "$1 $2");

  return text;
}

/** Dedupe key material: cleaned, lowercased, punctuation-stripped title. */
export function normalizeTitle(title?: string | null): string {
  return cleanOpenAlexText(title)
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
