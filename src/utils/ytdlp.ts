import { existsSync } from "node:fs";

const DEFAULT_EXTRACTOR_ARGS = "youtube:player_client=android_vr";

function normalizeEnvValue(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getYtDlpExtractorArgs(): string {
  return normalizeEnvValue(process.env.YTDLP_EXTRACTOR_ARGS) ?? DEFAULT_EXTRACTOR_ARGS;
}

export function getYtDlpCookiesPath(): string | null {
  const cookiePath = normalizeEnvValue(process.env.YTDLP_COOKIES_FILE);

  if (!cookiePath) {
    return null;
  }

  return existsSync(cookiePath) ? cookiePath : null;
}

export function getYtDlpCliArgs(url: string): string[] {
  const args = [
    "--no-warnings",
    "--no-playlist",
    "-g",
    "-f",
    "bestaudio/best",
  ];

  const extractorArgs = getYtDlpExtractorArgs();
  if (extractorArgs) {
    args.push("--extractor-args", extractorArgs);
  }

  const cookiesPath = getYtDlpCookiesPath();
  if (cookiesPath) {
    args.push("--cookies", cookiesPath);
  }

  args.push(url);
  return args;
}

export function getMpvYtdlRawOptions(): string[] {
  const rawOptions: string[] = [];
  const extractorArgs = getYtDlpExtractorArgs();

  if (extractorArgs) {
    rawOptions.push(`extractor-args=[${extractorArgs}]`);
  }

  const cookiesPath = getYtDlpCookiesPath();
  if (cookiesPath) {
    rawOptions.push(`cookies=${cookiesPath}`);
  }

  return rawOptions;
}

