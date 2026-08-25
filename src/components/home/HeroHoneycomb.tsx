import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  heroHoneycombNodesByGrid,
  resolveHeroHoneycombNodesFromResearchAreas,
  type HeroHoneycombResearchArea,
} from "@/lib/hero-honeycomb";
import { getPublicationsPath } from "@/lib/publications";
import { cn } from "@/lib/utils";
import { urlFor } from "../../../sanity/lib/image";
import type { SanityImage } from "../../../sanity/types";

/** Pointy-top hex geometry from Figma node 104:2. */
const HEX_WIDTH = 208;
const HEX_HEIGHT = 239;
const HEX_SVG_HEIGHT = 231.642;
const COL_STEP = 218;
const ROW_STEP = 188;
const ODD_ROW_OFFSET = 109;

const COL_START = -2;
const COL_END = 10;
const ROW_START = -1;
const ROW_END = 7;

const CENTER_COL = 3;
const CENTER_ROW = 2;

const HEX_SRC = {
  center: "/images/hero/hex-center.svg",
  node: "/images/hero/hex-node.svg",
  nodeBorder: "/images/hero/hex-node-border.svg",
  bg: "/images/hero/hex-bg.svg",
} as const;

const N_MARK_SRC = "/images/hero/n-mark.svg";

/** Direct CDN width — skip Next.js Image so the file is not downsampled again. */
const HEX_PHOTO_WIDTH = 960;

const HEX_PATH =
  "M0 69.9634C0 61.3708 4.5937 53.4337 12.0443 49.1533L92.0478 3.1899C99.4512 -1.06345 108.557 -1.06329 115.96 3.19031L195.956 49.1531C203.407 53.4337 208 61.3705 208 69.9628V161.679C208 170.271 203.407 178.208 195.956 182.489L115.96 228.451C108.557 232.705 99.4512 232.705 92.0478 228.452L12.0442 182.488C4.59368 178.208 0 170.271 0 161.678V69.9634Z";

/** objectBoundingBox units of HEX_PATH (÷ 208 × 231.642). */
const HEX_CLIP_PATH =
  "M0 0.302032C0 0.264938 0.022085 0.230674 0.057905 0.212195L0.442537 0.013771C0.478131 -0.004591 0.521909 -0.00459 0.5575 0.013773L0.942096 0.212194C0.977918 0.230674 1 0.264937 1 0.30203V0.697969C1 0.735061 0.977918 0.769325 0.942096 0.787806L0.5575 0.986224C0.521909 1.004589 0.478131 1.004589 0.442537 0.986229L0.057905 0.787802C0.022085 0.769325 0 0.735061 0 0.697965V0.302032Z";

function HeroHexClipDefs() {
  return (
    <svg aria-hidden className="absolute h-0 w-0">
      <defs>
        <clipPath id="hero-hex-photo-clip" clipPathUnits="objectBoundingBox">
          <path d={HEX_CLIP_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}

function HeroHexNodeBorder() {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${HEX_WIDTH} ${HEX_SVG_HEIGHT}`}
      className="hero-hex-node-border pointer-events-none absolute inset-0 size-full overflow-visible"
      fill="none"
    >
      <path
        d={HEX_PATH}
        stroke="#d2d5d8"
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

type ClusterCell = {
  kind: "center" | "node";
};

const CLUSTER: Record<string, ClusterCell> = {
  "2,1": { kind: "node" },
  "3,1": { kind: "node" },
  "2,2": { kind: "node" },
  "3,2": { kind: "center" },
  "4,2": { kind: "node" },
  "2,3": { kind: "node" },
  "3,3": { kind: "node" },
};

function cellKey(col: number, row: number) {
  return `${col},${row}`;
}

function hexOrigin(col: number, row: number) {
  const odd = row % 2 !== 0;
  return {
    x: col * COL_STEP + (odd ? ODD_ROW_OFFSET : 0),
    y: row * ROW_STEP,
  };
}

function cellHash(col: number, row: number) {
  return Math.abs((col * 7919 + row * 7877) ^ (col * row * 104729));
}

/** Per-cell opacity animation params (max = 1 is the full hex color). */
function backgroundAnimation(col: number, row: number) {
  const hash = cellHash(col, row);
  const baseT = (hash % 1000) / 1000;
  const rangeT = ((hash >> 10) % 1000) / 1000;
  const durationT = ((hash >> 20) % 1000) / 1000;
  const delayT = ((hash >> 5) % 1000) / 1000;

  const opacityMax = 0.88 + baseT * 0.12;
  const pulseRange = 0.08 + rangeT * 0.1;

  return {
    opacityMax,
    opacityMin: opacityMax - pulseRange,
    duration: 7 + durationT * 5,
    delay: delayT * 8,
  };
}

function getEnterDelay(col: number, row: number, kind?: ClusterCell["kind"]) {
  const dx = col - CENTER_COL;
  const dy = row - CENTER_ROW;
  const dist = Math.hypot(dx, dy);

  if (kind === "center") return 0.42;
  if (kind === "node") return 0.18 + dist * 0.08;
  return dist * 0.07;
}

function buildCells() {
  const cells: Array<{
    key: string;
    col: number;
    row: number;
    x: number;
    y: number;
    src: string;
    enterDelay: number;
    bgAnimation?: ReturnType<typeof backgroundAnimation>;
    cluster?: ClusterCell;
  }> = [];

  for (let row = ROW_START; row <= ROW_END; row += 1) {
    for (let col = COL_START; col <= COL_END; col += 1) {
      const key = cellKey(col, row);
      const { x, y } = hexOrigin(col, row);
      const cluster = CLUSTER[key];
      const isBackground = !cluster;
      cells.push({
        key,
        col,
        row,
        x,
        y,
        src: cluster
          ? cluster.kind === "center"
            ? HEX_SRC.center
            : HEX_SRC.node
          : HEX_SRC.bg,
        enterDelay: getEnterDelay(col, row, cluster?.kind),
        bgAnimation: isBackground ? backgroundAnimation(col, row) : undefined,
        cluster,
      });
    }
  }

  return cells;
}

const CELLS = buildCells();
const FLOWER_ORIGIN = hexOrigin(CENTER_COL, CENTER_ROW);
const FLOWER_CENTER_X = FLOWER_ORIGIN.x + HEX_WIDTH / 2;
const FLOWER_CENTER_Y = FLOWER_ORIGIN.y + HEX_HEIGHT / 2;

type HeroHoneycombProps = {
  className?: string;
  researchAreas?: HeroHoneycombResearchArea[];
};

type ResolvedNode = ReturnType<typeof resolveHeroHoneycombNodesFromResearchAreas>[number];

function nodeHasBackground(node?: ResolvedNode) {
  return Boolean(node?.image?.asset?.url || node?.fallbackImage);
}

function heroHexPhotoSrc(image?: SanityImage, fallbackImage?: string) {
  if (image?.asset) {
    return urlFor(image, { width: HEX_PHOTO_WIDTH, quality: 90, fit: "max" });
  }
  return fallbackImage;
}

export function HeroHoneycomb({ className, researchAreas }: HeroHoneycombProps) {
  const resolvedNodes = resolveHeroHoneycombNodesFromResearchAreas(researchAreas);
  const nodeByGrid = heroHoneycombNodesByGrid(resolvedNodes);

  return (
    <div
      className={cn("hero-honeycomb pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute top-1/2 left-1/2 h-px w-px [transform:translate(-50%,-50%)_scale(var(--hero-hex-scale))]">
        <HeroHexClipDefs />
        <div
          className="absolute"
          style={{ left: -FLOWER_CENTER_X, top: -FLOWER_CENTER_Y }}
        >
          {CELLS.map((cell) => {
            const node = nodeByGrid.get(cell.key);
            const isInteractive = cell.cluster?.kind === "node" && Boolean(node?.label);
            const isBackground = !cell.cluster;
            const hasBackground = nodeHasBackground(node);
            const photoSrc =
              cell.cluster?.kind === "node"
                ? heroHexPhotoSrc(node?.image, node?.fallbackImage)
                : undefined;
            const visual = (
              <div
                className={cn(
                  isInteractive
                    ? "hero-hex-node-visual"
                    : isBackground
                      ? "hero-hex-bg-visual absolute inset-0"
                      : "absolute inset-0",
                )}
                style={
                  isBackground && cell.bgAnimation
                    ? ({
                        "--hex-opacity-min": cell.bgAnimation.opacityMin,
                        "--hex-opacity-max": cell.bgAnimation.opacityMax,
                        "--hex-opacity-duration": `${cell.bgAnimation.duration}s`,
                        "--hex-opacity-delay": `${cell.enterDelay + 0.95 + cell.bgAnimation.delay}s`,
                      } as CSSProperties)
                    : undefined
                }
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="relative"
                    style={{ width: HEX_WIDTH, height: HEX_SVG_HEIGHT }}
                  >
                    {!(cell.cluster?.kind === "node" && hasBackground) ? (
                      <Image
                        src={cell.src}
                        alt=""
                        width={HEX_WIDTH}
                        height={HEX_SVG_HEIGHT}
                        unoptimized
                        className="size-full object-contain"
                      />
                    ) : null}
                    {cell.cluster?.kind === "node" && hasBackground ? (
                      <>
                        <div className="hero-hex-node-photo hero-hex-node-media absolute inset-0">
                          {photoSrc ? (
                            <Image
                              src={photoSrc}
                              alt=""
                              fill
                              unoptimized
                              sizes="960px"
                              className="scale-[1.04] object-cover"
                            />
                          ) : null}
                        </div>
                        <div
                          className="hero-hex-node-photo hero-hex-node-overlay absolute inset-0 bg-black/[0.66]"
                          aria-hidden
                        />
                      </>
                    ) : null}
                    {isInteractive ? (
                      <span className="hero-hex-node-photo hero-hex-node-shine" aria-hidden />
                    ) : null}
                    {isInteractive ? <HeroHexNodeBorder /> : null}
                  </div>
                </div>
                {cell.cluster?.kind === "center" ? (
                  <div className="hero-hex-center-mark absolute top-1/2 left-1/2 h-[148px] w-[126px] overflow-clip">
                    <Image
                      src={N_MARK_SRC}
                      alt=""
                      width={126}
                      height={148}
                      unoptimized
                      priority
                      className="size-full object-contain"
                    />
                  </div>
                ) : null}
                {node?.label ? (
                  <p
                    className={cn(
                      "hero-hex-node-label absolute inset-0 z-10 flex items-center justify-center px-6 text-center font-medium whitespace-pre-line",
                      hasBackground ? "text-text-inverse" : "text-text-primary",
                    )}
                  >
                    {node.label}
                  </p>
                ) : null}
              </div>
            );

            const cellStyle = {
              left: cell.x,
              top: cell.y,
              width: HEX_WIDTH,
              height: HEX_HEIGHT,
              "--hex-enter-delay": `${cell.enterDelay}s`,
            } as CSSProperties;

            if (isInteractive && node?.slug) {
              return (
                <Link
                  key={cell.key}
                  href={getPublicationsPath(node.slug)}
                  className="hero-hex-node hero-hex-enter absolute"
                  style={cellStyle}
                  aria-label={`${node.label.replace("\n", " ")} publications`}
                >
                  {visual}
                  <span className="hero-hex-node-hit" aria-hidden />
                </Link>
              );
            }

            if (isBackground) {
              return (
                <div
                  key={cell.key}
                  className="hero-hex-bg hero-hex-enter absolute"
                  style={cellStyle}
                >
                  {visual}
                  <span className="hero-hex-bg-glow" aria-hidden />
                  <span className="hero-hex-bg-hit" aria-hidden />
                </div>
              );
            }

            return (
              <div
                key={cell.key}
                className="hero-hex-enter absolute z-[1]"
                style={cellStyle}
              >
                {visual}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HeroHoneycomb;

export function HeroHoneycombSkeleton({ className }: HeroHoneycombProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "hero-honeycomb pointer-events-none absolute inset-0 overflow-hidden select-none",
        className,
      )}
    >
      <div className="absolute top-1/2 left-1/2 h-px w-px [transform:translate(-50%,-50%)_scale(var(--hero-hex-scale))]">
        <div
          className="absolute"
          style={{ left: -FLOWER_CENTER_X, top: -FLOWER_CENTER_Y }}
        >
          {CELLS.map((cell) => (
            <div
              key={cell.key}
              className={cn(
                "hero-hex-skeleton-cell absolute",
                cell.cluster?.kind === "center" && "hero-hex-skeleton-cell-center",
                cell.cluster?.kind === "node" && "hero-hex-skeleton-cell-node",
              )}
              style={{
                left: cell.x,
                top: cell.y,
                width: HEX_WIDTH,
                height: HEX_HEIGHT,
                opacity: cell.bgAnimation?.opacityMax ?? 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
