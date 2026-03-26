export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose prose-gray prose-sm">
      <h1 className="text-3xl font-bold text-[#252525] mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: March 2026</p>

      <p>
        AWSME Pty Ltd (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;) operates DataP.ai (&quot;Service&quot;).
        This Privacy Policy explains how we collect, use, disclose, and protect your personal information
        when you use our Service. By using the Service, you consent to the practices described herein.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. Information We Collect</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 Account Information</h3>
      <p>When you register, we collect: email address and encrypted password (PBKDF2 hashed — we never store plaintext passwords).</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 Investor Profile</h3>
      <p>
        If you complete the onboarding wizard, we collect: risk tolerance, investment horizon, preferred strategies,
        preferred exchanges, preferred sectors, portfolio size range, analysis preferences, and response style.
        This data is used solely to personalise your experience.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 Usage Data</h3>
      <p>
        We collect information about how you use the Service, including: pages visited, stocks analysed,
        chat messages with the AI copilot, watchlist selections, and feature usage.
        Chat conversations are stored to provide conversation history and improve our AI models.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 Device & Technical Data</h3>
      <p>
        We automatically collect: browser type, operating system, IP address, referring URLs, and session duration
        through standard web server logs and analytics tools.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 Payment Information</h3>
      <p>
        Payment processing is handled by Stripe. We do not store credit card numbers, bank account details,
        or other sensitive financial information on our servers. We only store your Stripe customer ID and subscription status.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Provide and personalise the Service (AI-generated analysis tailored to your profile)</li>
        <li>Process payments and manage subscriptions</li>
        <li>Send service-related communications (account verification, security alerts, subscription updates)</li>
        <li>Improve our AI models and analysis quality</li>
        <li>Monitor and prevent fraud, abuse, and security threats</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. AI & Chat Data</h2>
      <p>
        Your conversations with the AI copilot are stored in our database to provide conversation history
        and to extract preferences that improve future responses (e.g., remembering your risk tolerance).
        We may use anonymised and aggregated chat data to improve our AI models.
        We do not share your individual chat content with third parties except as described in Section 5.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. Data Sharing with AI Providers</h2>
      <p>
        To generate AI responses, we send your queries and relevant context to third-party AI providers including:
        Google (Gemini), OpenAI (GPT), and Anthropic (Claude).
        These providers process your data according to their respective privacy policies and data processing agreements.
        We do not send your email address, password, or payment information to AI providers.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. Data Sharing & Disclosure</h2>
      <p>We may share your information with:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Service providers:</strong> Stripe (payments), Google Cloud (hosting), AI model providers (as described above)</li>
        <li><strong>Legal compliance:</strong> When required by law, court order, or government regulation</li>
        <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
        <li><strong>With your consent:</strong> When you explicitly authorise sharing</li>
      </ul>
      <p>We do not sell your personal information to third parties for marketing purposes.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. Data Security</h2>
      <p>
        We implement industry-standard security measures including: encrypted passwords (PBKDF2),
        HTTPS encryption in transit, secure session management, and access controls.
        However, no method of transmission over the Internet is 100% secure.
        We cannot guarantee absolute security of your data.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. Data Retention</h2>
      <p>
        We retain your account data for as long as your account is active.
        Chat history is retained indefinitely to provide conversation continuity.
        If you delete your account, we will remove your personal data within 30 days,
        except where retention is required by law or for legitimate business purposes.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
        <li>Export your data in a portable format</li>
        <li>Object to or restrict certain processing</li>
        <li>Withdraw consent where processing is based on consent</li>
      </ul>
      <p>To exercise these rights, contact us at <a href="mailto:info@datap.ai" className="text-indigo-600 hover:underline">info@datap.ai</a>.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Cookies</h2>
      <p>
        We use essential cookies for authentication (session token) and language preference.
        We do not use advertising or tracking cookies.
        Third-party analytics tools may set their own cookies subject to their privacy policies.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. International Data Transfers</h2>
      <p>
        Our servers are hosted in Australia (AWS Sydney region).
        Your data may be processed by AI providers in the United States and other jurisdictions.
        By using the Service, you consent to the transfer of your data to these jurisdictions,
        which may have different data protection standards than your country of residence.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. Children</h2>
      <p>
        The Service is not intended for users under 18 years of age.
        We do not knowingly collect personal information from children.
        If we become aware that we have collected data from a child, we will delete it promptly.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time.
        Material changes will be notified via email or in-app notice.
        Continued use of the Service constitutes acceptance of the updated policy.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. Contact</h2>
      <p>
        For privacy-related inquiries:<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        Email: <a href="mailto:info@datap.ai" className="text-indigo-600 hover:underline">info@datap.ai</a><br />
        Phone: 0431 525 939
      </p>
    </div>
  );
}
