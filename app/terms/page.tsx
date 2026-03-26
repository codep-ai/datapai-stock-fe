export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 prose prose-gray prose-sm">
      <h1 className="text-3xl font-bold text-[#252525] mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: March 2026</p>

      <p>
        Welcome to DataP.ai (&quot;Service&quot;), operated by AWSME Pty Ltd (ABN pending), Suite 2/200 Mona Vale Rd, St Ives NSW 2075, Australia (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;).
        By accessing or using our Service, you agree to be bound by these Terms.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. Service Description</h2>
      <p>
        DataP.ai provides AI-powered stock market research, analysis, and intelligence tools covering multiple global exchanges.
        Our services include but are not limited to: technical analysis signals, fundamental analysis scoring, investor relations page monitoring,
        AI copilot chat, screener tools, and alert systems.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. Not Financial Advice</h2>
      <p className="font-semibold text-red-700">
        THE SERVICE IS FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY.
        NOTHING ON THIS PLATFORM CONSTITUTES FINANCIAL, INVESTMENT, LEGAL, OR TAX ADVICE.
      </p>
      <p>
        All AI-generated content, signals, scores, recommendations (including but not limited to BUY, SELL, HOLD, STRONG BUY, STRONG SELL signals),
        confidence scores, and analysis are produced by automated systems and large language models.
        They may contain errors, hallucinations, or outdated information. You should not rely on them as the sole basis for any investment decision.
      </p>
      <p>
        Always consult a qualified financial advisor before making investment decisions.
        Past performance does not guarantee future results. All investments carry risk, including the potential loss of principal.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. No Guarantee of Accuracy</h2>
      <p>
        We make no warranties or representations regarding the accuracy, completeness, timeliness, or reliability of any data, analysis, or content provided through the Service.
        Stock prices, financial data, and market information are sourced from third-party providers (including Yahoo Finance, Polygon.io, and others)
        and may be delayed, incomplete, or inaccurate. We are not responsible for errors or omissions in third-party data.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. Account Registration</h2>
      <p>
        You must provide accurate and complete information when creating an account.
        You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
        You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Service.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Use the Service for any unlawful purpose or to facilitate market manipulation, insider trading, or fraud</li>
        <li>Scrape, copy, redistribute, or commercially exploit any content or data from the Service without prior written consent</li>
        <li>Attempt to bypass security measures, rate limits, or access controls</li>
        <li>Use automated tools (bots, crawlers) to access the Service except through our documented APIs</li>
        <li>Impersonate any person or misrepresent your affiliation</li>
        <li>Upload malicious code, viruses, or harmful content</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. Subscription & Payment</h2>
      <p>
        Certain features require a paid subscription. Payments are processed by Stripe.
        Subscriptions auto-renew unless cancelled before the renewal date.
        Refunds are handled on a case-by-case basis at our discretion.
        We reserve the right to change pricing with 30 days notice.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. AI-Generated Content</h2>
      <p>
        The Service uses artificial intelligence and large language models (including but not limited to OpenAI GPT, Google Gemini, and Anthropic Claude)
        to generate analysis, summaries, and recommendations. AI-generated content may be inaccurate, biased, or misleading.
        We do not guarantee the quality or reliability of AI outputs.
        You acknowledge that AI models may produce different results for the same query and that results should be independently verified.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS
        SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
        INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR INVESTMENT LOSSES,
        ARISING FROM YOUR USE OF OR INABILITY TO USE THE SERVICE.
      </p>
      <p>
        OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR AUD $100, WHICHEVER IS GREATER.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless the Company from any claims, damages, losses, or expenses
        arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. Intellectual Property</h2>
      <p>
        All content, trademarks, logos, and intellectual property on the Service are owned by or licensed to the Company.
        You may not reproduce, distribute, or create derivative works without our prior written consent.
        Your use of the Service does not grant you any ownership rights.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. Data & Privacy</h2>
      <p>
        Your use of the Service is also governed by our <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>.
        We collect and process personal data as described therein.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. Third-Party Services</h2>
      <p>
        The Service integrates with third-party data providers, payment processors, and AI services.
        We are not responsible for the availability, accuracy, or security of third-party services.
        Your use of third-party services is subject to their respective terms and conditions.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. Termination</h2>
      <p>
        We may suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion.
        You may close your account at any time by contacting us at info@datap.ai.
        Upon termination, your right to use the Service ceases immediately.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. Governing Law</h2>
      <p>
        These Terms are governed by the laws of New South Wales, Australia.
        Any disputes shall be subject to the exclusive jurisdiction of the courts of New South Wales.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be notified via email or in-app notice.
        Continued use of the Service after changes constitutes acceptance of the updated Terms.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. Contact</h2>
      <p>
        For questions about these Terms, contact us at:<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        Email: <a href="mailto:info@datap.ai" className="text-indigo-600 hover:underline">info@datap.ai</a><br />
        Phone: 0431 525 939
      </p>
    </div>
  );
}
