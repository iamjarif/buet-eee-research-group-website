"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure as structureResolver } from "./sanity/structure";

export default defineConfig({
  name: "sdream",
  title: "NC Group CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure: structureResolver }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, { schemaType }) => {
      if (schemaType === "application") {
        return prev.filter((item) => item.action !== "publish");
      }

      return prev;
    },
  },
});
