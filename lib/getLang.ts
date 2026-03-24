/**
 * lib/getLang.ts  —  server-side language resolution
 * Reads the `lang` cookie (set by LangToggle) and validates against
 * supported languages.  Defaults to "en".
 */
import { cookies } from "next/headers";
import { type Lang, SUPPORTED_LANGS } from "./translations";

export async function getLang(): Promise<Lang> {
  const jar = await cookies();
  const val = jar.get("lang")?.value;
  if (val && (SUPPORTED_LANGS as string[]).includes(val)) {
    return val as Lang;
  }
  return "en";
}
