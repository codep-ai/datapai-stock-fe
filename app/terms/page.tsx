import { cookies } from "next/headers";
import { termsContent } from "./content";

export default async function TermsPage() {
  const lang = (await cookies()).get("lang")?.value ?? "en";
  const content = termsContent[lang] ?? termsContent.en;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose prose-gray prose-sm">
      {content}
    </div>
  );
}
