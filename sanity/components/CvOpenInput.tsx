"use client";

import { LaunchIcon } from "@sanity/icons/Launch";
import { Box, Button, Flex, Text } from "@sanity/ui";
import { useFormValue, type StringInputProps } from "sanity";

export function CvOpenInput(props: StringInputProps) {
  const cvDownloadUrl = typeof props.value === "string" ? props.value.trim() : "";
  const cvFilename = useFormValue(["cvFilename"]) as string | undefined;

  if (!cvDownloadUrl) {
    return (
      <Box padding={3}>
        <Text muted>
          No CV attached.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {cvFilename ? (
        <Box marginBottom={3}>
          <Text muted>{cvFilename}</Text>
        </Box>
      ) : null}
      <Flex>
        <Button
          as="a"
          href={cvDownloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          icon={LaunchIcon}
          text="Open CV"
          tone="primary"
        />
      </Flex>
    </Box>
  );
}

export default CvOpenInput;
