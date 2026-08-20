export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { getCvSigningSecret } = await import("@/lib/cv-access");
  getCvSigningSecret();
}
