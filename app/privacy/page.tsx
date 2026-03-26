import { cookies } from "next/headers";
import { privacyContent } from "./content";

export default async function PrivacyPage() {
  const lang = (await cookies()).get("lang")?.value ?? "en";
  const content = privacyContent[lang] ?? privacyContent.en;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose prose-gray prose-sm">
      {content}
    </div>
  );
}
