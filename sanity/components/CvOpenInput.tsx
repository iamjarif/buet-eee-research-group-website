"use client";

import { useState } from "react";
import { LaunchIcon } from "@sanity/icons/Launch";
import { Box, Button, Flex, Text } from "@sanity/ui";
import { useClient, useFormValue, type StringInputProps } from "sanity";

import { projectId } from "../env";
import { getStudioSessionToken } from "../lib/studio-auth";

export function CvOpenInput(_props: StringInputProps) {
  const documentId = useFormValue(["_id"]) as string | undefined;
  const cvFilename = useFormValue(["cvFilename"]) as string | undefined;
  const client = useClient({ apiVersion: "2026-08-13" });
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const filename = cvFilename?.trim() || "";
  const applicationId = documentId?.replace(/^drafts\./, "") ?? "";

  async function handleDownload() {
    const token =
      client.config().token?.trim() || getStudioSessionToken(projectId) || null;

    if (!token) {
      setError("Sign in to Sanity to download this CV.");
      return;
    }

    if (!applicationId) {
      setError("Unable to identify this application.");
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const fileResponse = await fetch(
        `/api/applications/${encodeURIComponent(applicationId)}/cv`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!fileResponse.ok) {
        const fileBody = (await fileResponse.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(fileBody?.error ?? `Unable to download CV (${fileResponse.status}).`);
        return;
      }

      const blob = await fileResponse.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename || "cv.pdf";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError("Unable to download CV.");
    } finally {
      setDownloading(false);
    }
  }

  if (!filename) {
    return (
      <Box padding={3}>
        <Text muted>No CV attached.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box marginBottom={3}>
        <Text>{filename}</Text>
      </Box>
      <Flex>
        <Button
          icon={LaunchIcon}
          text={downloading ? "Downloading…" : `Download ${filename}`}
          tone="primary"
          disabled={downloading || !applicationId}
          onClick={() => {
            void handleDownload();
          }}
        />
      </Flex>
      {error ? (
        <Box marginTop={3}>
          <Text size={1} muted>
            {error}
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}

export default CvOpenInput;
