"use client";

import { Box, Text } from "@sanity/ui";
import type { StringInputProps } from "sanity";

export function CvOpenInput(props: StringInputProps) {
  const cvFilename = typeof props.value === "string" ? props.value.trim() : "";

  if (!cvFilename) {
    return (
      <Box padding={3}>
        <Text muted>No CV attached.</Text>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Text>{cvFilename}</Text>
      <Box marginTop={3}>
        <Text muted size={1}>
          The file is stored privately. Use the signed download link from the
          application notification email — this document does not store a
          download URL.
        </Text>
      </Box>
    </Box>
  );
}

export default CvOpenInput;
