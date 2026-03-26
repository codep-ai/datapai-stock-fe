import { ReactNode } from "react";

const EMAIL_LINK = (
  <a href="mailto:info@datap.ai" className="text-indigo-600 hover:underline">
    info@datap.ai
  </a>
);

const PRIVACY_LINK = (
  <a href="/privacy" className="text-indigo-600 hover:underline">
    Privacy Policy
  </a>
);

/* ---------- disclaimer shown on non-English pages ---------- */
const disclaimers: Record<string, string> = {
  zh: "这是翻译版本。如有争议，以英文版本为准。",
  "zh-TW": "這是翻譯版本。如有爭議，以英文版本為準。",
  ja: "これは翻訳版です。法的拘束力を持つのは英語版です。",
  ko: "이것은 번역본입니다. 법적 구속력이 있는 것은 영어 버전입니다.",
  vi: "Đây là bản dịch. Phiên bản tiếng Anh có giá trị pháp lý ràng buộc.",
  th: "นี่คือฉบับแปล ฉบับภาษาอังกฤษเป็นฉบับที่มีผลผูกพันทางกฎหมาย",
  ms: "Ini adalah versi terjemahan. Versi Bahasa Inggeris adalah yang mengikat secara sah.",
};

const privacyLinks: Record<string, ReactNode> = {
  en: <a href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>,
  zh: <a href="/privacy" className="text-indigo-600 hover:underline">隐私政策</a>,
  "zh-TW": <a href="/privacy" className="text-indigo-600 hover:underline">隱私政策</a>,
  ja: <a href="/privacy" className="text-indigo-600 hover:underline">プライバシーポリシー</a>,
  ko: <a href="/privacy" className="text-indigo-600 hover:underline">개인정보 처리방침</a>,
  vi: <a href="/privacy" className="text-indigo-600 hover:underline">Chính Sách Bảo Mật</a>,
  th: <a href="/privacy" className="text-indigo-600 hover:underline">นโยบายความเป็นส่วนตัว</a>,
  ms: <a href="/privacy" className="text-indigo-600 hover:underline">Dasar Privasi</a>,
};

function Disclaimer({ lang }: { lang: string }) {
  if (lang === "en" || !disclaimers[lang]) return null;
  return (
    <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded px-4 py-2 text-sm mb-6">
      {disclaimers[lang]}{" "}
      <a href="/terms?lang=en" className="underline">
        English version
      </a>
    </p>
  );
}

/* ================================================================
   ENGLISH
   ================================================================ */
function TermsEN() {
  return (
    <>
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

      <h2 className="text-xl font-bold mt-8 mb-3">6. Subscription &amp; Payment</h2>
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

      <h2 className="text-xl font-bold mt-8 mb-3">11. Data &amp; Privacy</h2>
      <p>
        Your use of the Service is also governed by our {privacyLinks.en}.
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
        Email: {EMAIL_LINK}<br />
        Phone: 0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   SIMPLIFIED CHINESE (zh)
   ================================================================ */
function TermsZH() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">服务条款</h1>
      <p className="text-gray-400 text-sm mb-8">最后更新：2026年3月</p>
      <Disclaimer lang="zh" />

      <p>
        欢迎使用 DataP.ai（以下简称"服务"），由 AWSME Pty Ltd（ABN 待定），地址：Suite 2/200 Mona Vale Rd, St Ives NSW 2075, 澳大利亚（以下简称"公司"、"我们"）运营。
        访问或使用本服务即表示您同意受这些条款的约束。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. 服务描述</h2>
      <p>
        DataP.ai 提供基于 AI 的股票市场研究、分析和智能工具，覆盖多个全球交易所。
        我们的服务包括但不限于：技术分析信号、基本面分析评分、投资者关系页面监控、
        AI 助手聊天、筛选工具和警报系统。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 非投资建议</h2>
      <p className="font-semibold text-red-700">
        本服务仅供信息和教育目的使用。
        本平台上的任何内容均不构成财务、投资、法律或税务建议。
      </p>
      <p>
        所有 AI 生成的内容、信号、评分、建议（包括但不限于买入、卖出、持有、强烈买入、强烈卖出信号）、
        置信度评分和分析均由自动化系统和大型语言模型生成。
        它们可能包含错误、幻觉或过时信息。您不应将其作为任何投资决策的唯一依据。
      </p>
      <p>
        在做出投资决策之前，请务必咨询合格的财务顾问。
        过去的表现不保证未来的结果。所有投资都有风险，包括本金损失的可能性。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. 不保证准确性</h2>
      <p>
        我们不对通过服务提供的任何数据、分析或内容的准确性、完整性、及时性或可靠性作出任何保证或陈述。
        股票价格、财务数据和市场信息来自第三方提供商（包括 Yahoo Finance、Polygon.io 等），
        可能存在延迟、不完整或不准确的情况。我们不对第三方数据中的错误或遗漏负责。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. 账户注册</h2>
      <p>
        创建账户时，您必须提供准确和完整的信息。
        您有责任维护登录凭据的机密性以及账户下的所有活动。
        您必须年满 18 岁（或您所在司法管辖区的成年年龄）才能使用本服务。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. 可接受的使用</h2>
      <p>您同意不得：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>将服务用于任何非法目的，或用于促进市场操纵、内幕交易或欺诈</li>
        <li>未经事先书面同意，爬取、复制、再分发或商业利用服务中的任何内容或数据</li>
        <li>试图绕过安全措施、速率限制或访问控制</li>
        <li>使用自动化工具（机器人、爬虫）访问服务，除非通过我们记录的 API</li>
        <li>冒充任何人或虚假陈述您的关联关系</li>
        <li>上传恶意代码、病毒或有害内容</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. 订阅与付款</h2>
      <p>
        某些功能需要付费订阅。付款由 Stripe 处理。
        订阅会自动续订，除非在续订日期之前取消。
        退款将由我们自行决定逐案处理。
        我们保留提前 30 天通知后更改定价的权利。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. AI 生成的内容</h2>
      <p>
        本服务使用人工智能和大型语言模型（包括但不限于 OpenAI GPT、Google Gemini 和 Anthropic Claude）
        来生成分析、摘要和建议。AI 生成的内容可能不准确、有偏见或具有误导性。
        我们不保证 AI 输出的质量或可靠性。
        您承认 AI 模型可能对同一查询产生不同结果，结果应经过独立验证。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. 责任限制</h2>
      <p>
        在法律允许的最大范围内，公司及其管理人员、董事、员工和代理人不对因您使用或无法使用本服务而产生的任何间接、
        附带、特殊、后果性或惩罚性损害承担责任，包括但不限于利润损失、数据损失、商誉损失或投资损失。
      </p>
      <p>
        我们对因本服务引起的任何索赔的总责任不超过您在索赔前 12 个月内支付给我们的金额，
        或 100 澳元，以较高者为准。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. 赔偿</h2>
      <p>
        您同意赔偿并使公司免受因您使用服务、违反这些条款或侵犯任何第三方权利而产生的任何索赔、
        损害、损失或费用。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 知识产权</h2>
      <p>
        服务上的所有内容、商标、标志和知识产权均归公司所有或已获得许可。
        未经我们事先书面同意，您不得复制、分发或创建衍生作品。
        您使用本服务并不授予您任何所有权。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. 数据与隐私</h2>
      <p>
        您对本服务的使用也受我们的{privacyLinks.zh}约束。
        我们按其中所述收集和处理个人数据。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 第三方服务</h2>
      <p>
        本服务与第三方数据提供商、支付处理商和 AI 服务集成。
        我们不对第三方服务的可用性、准确性或安全性负责。
        您对第三方服务的使用受其各自条款和条件的约束。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. 终止</h2>
      <p>
        因违反这些条款或出于我们自行决定的任何其他原因，我们可随时暂停或终止您的账户。
        您可以随时通过联系 info@datap.ai 关闭您的账户。
        终止后，您使用本服务的权利立即终止。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. 适用法律</h2>
      <p>
        这些条款受澳大利亚新南威尔士州法律管辖。
        任何争议应提交新南威尔士州法院的专属管辖。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. 条款变更</h2>
      <p>
        我们可能会不时更新这些条款。重大变更将通过电子邮件或应用内通知告知。
        变更后继续使用本服务即表示接受更新的条款。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. 联系方式</h2>
      <p>
        如对这些条款有疑问，请联系：<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        电子邮件：{EMAIL_LINK}<br />
        电话：0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   TRADITIONAL CHINESE (zh-TW)
   ================================================================ */
function TermsZHTW() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">服務條款</h1>
      <p className="text-gray-400 text-sm mb-8">最後更新：2026年3月</p>
      <Disclaimer lang="zh-TW" />

      <p>
        歡迎使用 DataP.ai（以下簡稱「服務」），由 AWSME Pty Ltd（ABN 待定），地址：Suite 2/200 Mona Vale Rd, St Ives NSW 2075, 澳洲（以下簡稱「公司」、「我們」）營運。
        存取或使用本服務即表示您同意受這些條款的約束。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. 服務描述</h2>
      <p>
        DataP.ai 提供基於 AI 的股票市場研究、分析和智慧工具，涵蓋多個全球交易所。
        我們的服務包括但不限於：技術分析訊號、基本面分析評分、投資者關係頁面監控、
        AI 助手聊天、篩選工具和警報系統。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 非投資建議</h2>
      <p className="font-semibold text-red-700">
        本服務僅供資訊和教育目的使用。
        本平台上的任何內容均不構成財務、投資、法律或稅務建議。
      </p>
      <p>
        所有 AI 生成的內容、訊號、評分、建議（包括但不限於買入、賣出、持有、強烈買入、強烈賣出訊號）、
        信心度評分和分析均由自動化系統和大型語言模型產生。
        它們可能包含錯誤、幻覺或過時資訊。您不應將其作為任何投資決策的唯一依據。
      </p>
      <p>
        在做出投資決策之前，請務必諮詢合格的財務顧問。
        過去的表現不保證未來的結果。所有投資都有風險，包括本金損失的可能性。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. 不保證準確性</h2>
      <p>
        我們不對透過服務提供的任何資料、分析或內容的準確性、完整性、及時性或可靠性作出任何保證或陳述。
        股票價格、財務資料和市場資訊來自第三方提供商（包括 Yahoo Finance、Polygon.io 等），
        可能存在延遲、不完整或不準確的情況。我們不對第三方資料中的錯誤或遺漏負責。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. 帳戶註冊</h2>
      <p>
        建立帳戶時，您必須提供準確和完整的資訊。
        您有責任維護登入憑據的機密性以及帳戶下的所有活動。
        您必須年滿 18 歲（或您所在司法管轄區的成年年齡）才能使用本服務。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. 可接受的使用</h2>
      <p>您同意不得：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>將服務用於任何非法目的，或用於促進市場操縱、內線交易或詐欺</li>
        <li>未經事先書面同意，爬取、複製、再分發或商業利用服務中的任何內容或資料</li>
        <li>試圖繞過安全措施、速率限制或存取控制</li>
        <li>使用自動化工具（機器人、爬蟲）存取服務，除非透過我們記錄的 API</li>
        <li>冒充任何人或虛假陳述您的關聯關係</li>
        <li>上傳惡意程式碼、病毒或有害內容</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. 訂閱與付款</h2>
      <p>
        某些功能需要付費訂閱。付款由 Stripe 處理。
        訂閱會自動續訂，除非在續訂日期之前取消。
        退款將由我們自行決定逐案處理。
        我們保留提前 30 天通知後更改定價的權利。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. AI 生成的內容</h2>
      <p>
        本服務使用人工智慧和大型語言模型（包括但不限於 OpenAI GPT、Google Gemini 和 Anthropic Claude）
        來產生分析、摘要和建議。AI 生成的內容可能不準確、有偏見或具有誤導性。
        我們不保證 AI 輸出的品質或可靠性。
        您承認 AI 模型可能對同一查詢產生不同結果，結果應經過獨立驗證。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. 責任限制</h2>
      <p>
        在法律允許的最大範圍內，公司及其管理人員、董事、員工和代理人不對因您使用或無法使用本服務而產生的任何間接、
        附帶、特殊、後果性或懲罰性損害承擔責任，包括但不限於利潤損失、資料損失、商譽損失或投資損失。
      </p>
      <p>
        我們對因本服務引起的任何索賠的總責任不超過您在索賠前 12 個月內支付給我們的金額，
        或 100 澳元，以較高者為準。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. 賠償</h2>
      <p>
        您同意賠償並使公司免受因您使用服務、違反這些條款或侵犯任何第三方權利而產生的任何索賠、
        損害、損失或費用。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 智慧財產權</h2>
      <p>
        服務上的所有內容、商標、標誌和智慧財產權均歸公司所有或已取得授權。
        未經我們事先書面同意，您不得複製、分發或建立衍生作品。
        您使用本服務並不授予您任何所有權。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. 資料與隱私</h2>
      <p>
        您對本服務的使用也受我們的{privacyLinks["zh-TW"]}約束。
        我們按其中所述收集和處理個人資料。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 第三方服務</h2>
      <p>
        本服務與第三方資料提供商、付款處理商和 AI 服務整合。
        我們不對第三方服務的可用性、準確性或安全性負責。
        您對第三方服務的使用受其各自條款和條件的約束。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. 終止</h2>
      <p>
        因違反這些條款或出於我們自行決定的任何其他原因，我們可隨時暫停或終止您的帳戶。
        您可以隨時透過聯繫 info@datap.ai 關閉您的帳戶。
        終止後，您使用本服務的權利立即終止。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. 適用法律</h2>
      <p>
        這些條款受澳洲新南威爾士州法律管轄。
        任何爭議應提交新南威爾士州法院的專屬管轄。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. 條款變更</h2>
      <p>
        我們可能會不時更新這些條款。重大變更將透過電子郵件或應用程式內通知告知。
        變更後繼續使用本服務即表示接受更新的條款。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. 聯絡方式</h2>
      <p>
        如對這些條款有疑問，請聯繫：<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        電子郵件：{EMAIL_LINK}<br />
        電話：0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   JAPANESE (ja)
   ================================================================ */
function TermsJA() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">利用規約</h1>
      <p className="text-gray-400 text-sm mb-8">最終更新：2026年3月</p>
      <Disclaimer lang="ja" />

      <p>
        DataP.ai（以下「本サービス」）へようこそ。本サービスは AWSME Pty Ltd（ABN申請中）、所在地：Suite 2/200 Mona Vale Rd, St Ives NSW 2075, オーストラリア（以下「当社」）が運営しています。
        本サービスにアクセスまたは利用することにより、お客様は本規約に拘束されることに同意したものとみなされます。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. サービスの説明</h2>
      <p>
        DataP.ai は、複数のグローバル取引所をカバーする AI 搭載の株式市場リサーチ、分析、インテリジェンスツールを提供します。
        当社のサービスには、テクニカル分析シグナル、ファンダメンタル分析スコアリング、IR ページ監視、
        AI コパイロットチャット、スクリーナーツール、アラートシステムが含まれますが、これらに限定されません。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 投資助言ではありません</h2>
      <p className="font-semibold text-red-700">
        本サービスは情報提供および教育目的のみです。
        本プラットフォーム上のいかなるものも、金融、投資、法律、または税務に関する助言を構成するものではありません。
      </p>
      <p>
        AI が生成したすべてのコンテンツ、シグナル、スコア、推奨（買い、売り、保持、強い買い、強い売りシグナルを含むがこれに限定されない）、
        信頼度スコア、分析は、自動化システムおよび大規模言語モデルによって生成されています。
        エラー、ハルシネーション、古い情報が含まれる可能性があります。投資判断の唯一の根拠として依存すべきではありません。
      </p>
      <p>
        投資判断を行う前に、必ず適格な金融アドバイザーに相談してください。
        過去の実績は将来の成果を保証するものではありません。すべての投資には元本損失のリスクがあります。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. 正確性の保証なし</h2>
      <p>
        当社は、本サービスを通じて提供されるデータ、分析、コンテンツの正確性、完全性、適時性、信頼性について、いかなる保証も行いません。
        株価、財務データ、市場情報は、第三者プロバイダー（Yahoo Finance、Polygon.io など）から取得されており、
        遅延、不完全、不正確な場合があります。第三者データのエラーや脱落について当社は責任を負いません。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. アカウント登録</h2>
      <p>
        アカウント作成時に正確かつ完全な情報を提供する必要があります。
        ログイン資格情報の機密性の維持およびアカウント下のすべての活動について責任を負います。
        本サービスを利用するには、18歳以上（またはお住まいの管轄区域の成年年齢）である必要があります。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. 許容される使用</h2>
      <p>以下の行為を行わないことに同意します：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>違法な目的や、市場操作、インサイダー取引、詐欺を助長するために本サービスを使用すること</li>
        <li>事前の書面による同意なく、本サービスのコンテンツやデータをスクレイピング、コピー、再配布、商業利用すること</li>
        <li>セキュリティ対策、レート制限、アクセス制御を迂回しようとすること</li>
        <li>文書化された API 以外の自動化ツール（ボット、クローラー）を使用して本サービスにアクセスすること</li>
        <li>他人になりすましたり、所属を偽ること</li>
        <li>悪意のあるコード、ウイルス、有害なコンテンツをアップロードすること</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. サブスクリプションと支払い</h2>
      <p>
        一部の機能には有料サブスクリプションが必要です。支払いは Stripe が処理します。
        サブスクリプションは更新日前にキャンセルしない限り自動更新されます。
        返金は当社の裁量により個別に対応します。
        30日前の通知により価格を変更する権利を留保します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. AI 生成コンテンツ</h2>
      <p>
        本サービスは、人工知能と大規模言語モデル（OpenAI GPT、Google Gemini、Anthropic Claude を含むがこれに限定されない）を使用して
        分析、要約、推奨を生成します。AI 生成コンテンツは不正確、偏向的、または誤解を招く場合があります。
        AI 出力の品質や信頼性を保証しません。
        AI モデルが同じクエリに対して異なる結果を生成する場合があり、結果は独立して検証する必要があることを認識します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. 責任の制限</h2>
      <p>
        法律で許される最大限度において、当社およびその役員、取締役、従業員、代理人は、
        本サービスの利用または利用不能から生じる間接的、付随的、特別、結果的、または懲罰的損害
        （利益の損失、データの損失、のれんの損失、投資損失を含むがこれに限定されない）について責任を負いません。
      </p>
      <p>
        本サービスに起因するいかなる請求に対する当社の総責任は、請求前12ヶ月間にお客様が当社に支払った金額、
        または100豪ドルのいずれか大きい方を超えないものとします。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. 補償</h2>
      <p>
        お客様は、本サービスの利用、本規約の違反、または第三者の権利侵害から生じるいかなる請求、損害、損失、
        費用についても、当社を補償し免責することに同意します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 知的財産</h2>
      <p>
        本サービス上のすべてのコンテンツ、商標、ロゴ、知的財産は当社が所有するか、当社にライセンス供与されています。
        当社の事前の書面による同意なく、複製、配布、派生物の作成を行うことはできません。
        本サービスの利用によりお客様にいかなる所有権も付与されません。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. データとプライバシー</h2>
      <p>
        本サービスの利用は当社の{privacyLinks.ja}にも準拠します。
        当社はその中に記載された通りに個人データを収集・処理します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 第三者サービス</h2>
      <p>
        本サービスは第三者のデータプロバイダー、決済処理業者、AI サービスと連携しています。
        第三者サービスの可用性、正確性、セキュリティについて当社は責任を負いません。
        第三者サービスの利用はそれぞれの利用規約に従います。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. 解約</h2>
      <p>
        本規約の違反またはその他の理由により、当社の裁量でいつでもお客様のアカウントを停止または解約することがあります。
        info@datap.ai に連絡していただくことで、いつでもアカウントを閉鎖できます。
        解約後、本サービスの利用権は直ちに終了します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. 準拠法</h2>
      <p>
        本規約はオーストラリア・ニューサウスウェールズ州の法律に準拠します。
        紛争はニューサウスウェールズ州の裁判所の専属管轄に服するものとします。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. 規約の変更</h2>
      <p>
        本規約は随時更新される場合があります。重要な変更はメールまたはアプリ内通知でお知らせします。
        変更後の本サービスの継続的な利用は、更新された規約の承諾を意味します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. お問い合わせ</h2>
      <p>
        本規約に関するご質問は、以下までお問い合わせください：<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        メール：{EMAIL_LINK}<br />
        電話：0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   KOREAN (ko)
   ================================================================ */
function TermsKO() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">이용약관</h1>
      <p className="text-gray-400 text-sm mb-8">최종 업데이트: 2026년 3월</p>
      <Disclaimer lang="ko" />

      <p>
        DataP.ai(&quot;서비스&quot;)에 오신 것을 환영합니다. AWSME Pty Ltd(ABN 신청 중), 주소: Suite 2/200 Mona Vale Rd, St Ives NSW 2075, 호주(&quot;회사&quot;, &quot;당사&quot;)가 운영합니다.
        본 서비스에 접속하거나 이용함으로써 귀하는 본 약관에 구속되는 것에 동의합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. 서비스 설명</h2>
      <p>
        DataP.ai는 여러 글로벌 거래소를 대상으로 AI 기반 주식 시장 리서치, 분석 및 인텔리전스 도구를 제공합니다.
        당사 서비스에는 기술적 분석 시그널, 펀더멘탈 분석 스코어링, IR 페이지 모니터링,
        AI 코파일럿 채팅, 스크리너 도구 및 알림 시스템이 포함되지만 이에 국한되지 않습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 투자 조언이 아닙니다</h2>
      <p className="font-semibold text-red-700">
        본 서비스는 정보 제공 및 교육 목적으로만 제공됩니다.
        본 플랫폼의 어떠한 것도 재무, 투자, 법률 또는 세무 조언을 구성하지 않습니다.
      </p>
      <p>
        AI가 생성한 모든 콘텐츠, 시그널, 점수, 추천(매수, 매도, 보유, 강력 매수, 강력 매도 시그널을 포함하되 이에 국한되지 않음),
        신뢰도 점수 및 분석은 자동화 시스템과 대규모 언어 모델에 의해 생성됩니다.
        오류, 환각 또는 오래된 정보가 포함될 수 있습니다. 투자 결정의 유일한 근거로 의존해서는 안 됩니다.
      </p>
      <p>
        투자 결정을 내리기 전에 반드시 자격을 갖춘 재무 고문과 상담하십시오.
        과거 실적이 미래 결과를 보장하지 않습니다. 모든 투자에는 원금 손실 위험이 있습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. 정확성 보장 없음</h2>
      <p>
        당사는 서비스를 통해 제공되는 데이터, 분석 또는 콘텐츠의 정확성, 완전성, 적시성 또는 신뢰성에 대해
        어떠한 보증이나 진술도 하지 않습니다. 주가, 재무 데이터 및 시장 정보는 제3자 제공업체
        (Yahoo Finance, Polygon.io 등)에서 제공되며, 지연, 불완전 또는 부정확할 수 있습니다.
        제3자 데이터의 오류나 누락에 대해 당사는 책임을 지지 않습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. 계정 등록</h2>
      <p>
        계정 생성 시 정확하고 완전한 정보를 제공해야 합니다.
        로그인 자격 증명의 기밀 유지와 계정 하의 모든 활동에 대해 귀하가 책임집니다.
        본 서비스를 이용하려면 18세 이상(또는 해당 관할권의 성년 나이)이어야 합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. 허용되는 사용</h2>
      <p>다음을 하지 않을 것에 동의합니다:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>불법적인 목적이나 시장 조작, 내부자 거래 또는 사기를 조장하기 위해 서비스를 사용하는 것</li>
        <li>사전 서면 동의 없이 서비스의 콘텐츠나 데이터를 스크래핑, 복사, 재배포 또는 상업적으로 이용하는 것</li>
        <li>보안 조치, 속도 제한 또는 접근 제어를 우회하려고 시도하는 것</li>
        <li>문서화된 API 이외의 자동화 도구(봇, 크롤러)를 사용하여 서비스에 접근하는 것</li>
        <li>타인을 사칭하거나 소속을 허위로 진술하는 것</li>
        <li>악성 코드, 바이러스 또는 유해한 콘텐츠를 업로드하는 것</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. 구독 및 결제</h2>
      <p>
        일부 기능은 유료 구독이 필요합니다. 결제는 Stripe가 처리합니다.
        구독은 갱신일 전에 취소하지 않는 한 자동 갱신됩니다.
        환불은 당사 재량에 따라 사안별로 처리됩니다.
        30일 전 통지로 가격을 변경할 권리를 보유합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. AI 생성 콘텐츠</h2>
      <p>
        본 서비스는 인공지능과 대규모 언어 모델(OpenAI GPT, Google Gemini, Anthropic Claude를 포함하되 이에 국한되지 않음)을
        사용하여 분석, 요약 및 추천을 생성합니다. AI 생성 콘텐츠는 부정확하거나, 편향되거나, 오해를 불러일으킬 수 있습니다.
        AI 출력의 품질이나 신뢰성을 보장하지 않습니다.
        AI 모델이 동일한 쿼리에 대해 다른 결과를 생성할 수 있으며 결과는 독립적으로 검증되어야 함을 인정합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. 책임 제한</h2>
      <p>
        법률이 허용하는 최대 범위 내에서, 회사 및 그 임원, 이사, 직원, 대리인은 서비스의 사용 또는 사용 불능으로 인해
        발생하는 간접적, 부수적, 특별, 결과적 또는 징벌적 손해(이익 손실, 데이터 손실, 영업권 손실 또는 투자 손실을
        포함하되 이에 국한되지 않음)에 대해 책임을 지지 않습니다.
      </p>
      <p>
        본 서비스에서 발생하는 모든 청구에 대한 당사의 총 책임은 청구 전 12개월 동안 귀하가 당사에 지불한 금액 또는
        100 호주달러 중 더 큰 금액을 초과하지 않습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. 배상</h2>
      <p>
        귀하는 서비스 사용, 본 약관 위반 또는 제3자 권리 침해로 인해 발생하는 모든 청구, 손해, 손실 또는 비용에 대해
        회사를 배상하고 면책할 것에 동의합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 지적 재산권</h2>
      <p>
        서비스상의 모든 콘텐츠, 상표, 로고 및 지적 재산권은 회사가 소유하거나 라이선스를 받았습니다.
        당사의 사전 서면 동의 없이 복제, 배포 또는 파생 작품을 만들 수 없습니다.
        서비스 사용으로 귀하에게 어떠한 소유권도 부여되지 않습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. 데이터 및 개인정보</h2>
      <p>
        서비스 이용은 당사의 {privacyLinks.ko}에도 적용됩니다.
        당사는 그에 기술된 대로 개인 데이터를 수집하고 처리합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 제3자 서비스</h2>
      <p>
        본 서비스는 제3자 데이터 제공업체, 결제 처리업체 및 AI 서비스와 통합됩니다.
        제3자 서비스의 가용성, 정확성 또는 보안에 대해 당사는 책임을 지지 않습니다.
        제3자 서비스 이용은 해당 서비스의 이용약관에 따릅니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. 해지</h2>
      <p>
        본 약관 위반 또는 기타 이유로 당사 재량에 따라 언제든지 귀하의 계정을 일시 중지하거나 해지할 수 있습니다.
        info@datap.ai로 연락하여 언제든지 계정을 폐쇄할 수 있습니다.
        해지 시 서비스 이용 권한은 즉시 종료됩니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. 준거법</h2>
      <p>
        본 약관은 호주 뉴사우스웨일스 주 법률에 의해 규율됩니다.
        모든 분쟁은 뉴사우스웨일스 주 법원의 전속 관할에 따릅니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. 약관 변경</h2>
      <p>
        본 약관은 수시로 업데이트될 수 있습니다. 중요한 변경은 이메일 또는 앱 내 알림으로 통지됩니다.
        변경 후 서비스를 계속 사용하면 업데이트된 약관을 수락하는 것으로 간주됩니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. 문의</h2>
      <p>
        본 약관에 대한 문의:<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        이메일: {EMAIL_LINK}<br />
        전화: 0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   VIETNAMESE (vi)
   ================================================================ */
function TermsVI() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">Điều Khoản Dịch Vụ</h1>
      <p className="text-gray-400 text-sm mb-8">Cập nhật lần cuối: Tháng 3, 2026</p>
      <Disclaimer lang="vi" />

      <p>
        Chào mừng bạn đến với DataP.ai (&quot;Dịch vụ&quot;), được vận hành bởi AWSME Pty Ltd (ABN đang chờ), Suite 2/200 Mona Vale Rd, St Ives NSW 2075, Úc (&quot;Công ty&quot;, &quot;chúng tôi&quot;).
        Bằng việc truy cập hoặc sử dụng Dịch vụ, bạn đồng ý bị ràng buộc bởi các Điều khoản này.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. Mô Tả Dịch Vụ</h2>
      <p>
        DataP.ai cung cấp các công cụ nghiên cứu, phân tích và thông minh thị trường chứng khoán dựa trên AI, bao phủ nhiều sàn giao dịch toàn cầu.
        Dịch vụ của chúng tôi bao gồm nhưng không giới hạn: tín hiệu phân tích kỹ thuật, chấm điểm phân tích cơ bản, giám sát trang quan hệ nhà đầu tư,
        trò chuyện trợ lý AI, công cụ sàng lọc và hệ thống cảnh báo.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. Không Phải Tư Vấn Tài Chính</h2>
      <p className="font-semibold text-red-700">
        DỊCH VỤ CHỈ DÀNH CHO MỤC ĐÍCH THÔNG TIN VÀ GIÁO DỤC.
        KHÔNG CÓ BẤT KỲ NỘI DUNG NÀO TRÊN NỀN TẢNG NÀY CẤU THÀNH TƯ VẤN TÀI CHÍNH, ĐẦU TƯ, PHÁP LÝ HOẶC THUẾ.
      </p>
      <p>
        Tất cả nội dung do AI tạo ra, tín hiệu, điểm số, khuyến nghị (bao gồm nhưng không giới hạn tín hiệu MUA, BÁN, GIỮ, MUA MẠNH, BÁN MẠNH),
        điểm tin cậy và phân tích đều được tạo bởi hệ thống tự động và mô hình ngôn ngữ lớn.
        Chúng có thể chứa lỗi, ảo giác hoặc thông tin lỗi thời. Bạn không nên dựa vào chúng làm cơ sở duy nhất cho bất kỳ quyết định đầu tư nào.
      </p>
      <p>
        Luôn tham khảo ý kiến cố vấn tài chính có trình độ trước khi đưa ra quyết định đầu tư.
        Hiệu suất trong quá khứ không đảm bảo kết quả trong tương lai. Mọi khoản đầu tư đều có rủi ro, bao gồm khả năng mất vốn gốc.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. Không Đảm Bảo Tính Chính Xác</h2>
      <p>
        Chúng tôi không đưa ra bất kỳ bảo đảm hoặc cam kết nào về tính chính xác, đầy đủ, kịp thời hoặc đáng tin cậy của bất kỳ dữ liệu, phân tích hoặc nội dung nào được cung cấp qua Dịch vụ.
        Giá cổ phiếu, dữ liệu tài chính và thông tin thị trường được lấy từ nhà cung cấp bên thứ ba (bao gồm Yahoo Finance, Polygon.io và các nguồn khác)
        và có thể bị trễ, không đầy đủ hoặc không chính xác. Chúng tôi không chịu trách nhiệm về lỗi hoặc thiếu sót trong dữ liệu bên thứ ba.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. Đăng Ký Tài Khoản</h2>
      <p>
        Bạn phải cung cấp thông tin chính xác và đầy đủ khi tạo tài khoản.
        Bạn chịu trách nhiệm duy trì tính bảo mật của thông tin đăng nhập và tất cả hoạt động dưới tài khoản của bạn.
        Bạn phải từ 18 tuổi trở lên (hoặc tuổi trưởng thành tại khu vực pháp lý của bạn) để sử dụng Dịch vụ.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. Sử Dụng Được Chấp Nhận</h2>
      <p>Bạn đồng ý không:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Sử dụng Dịch vụ cho mục đích bất hợp pháp hoặc để tạo điều kiện cho thao túng thị trường, giao dịch nội gián hoặc gian lận</li>
        <li>Thu thập, sao chép, phân phối lại hoặc khai thác thương mại bất kỳ nội dung hoặc dữ liệu nào từ Dịch vụ mà không có sự đồng ý bằng văn bản trước</li>
        <li>Cố gắng vượt qua các biện pháp bảo mật, giới hạn tốc độ hoặc kiểm soát truy cập</li>
        <li>Sử dụng công cụ tự động (bot, trình thu thập) để truy cập Dịch vụ ngoại trừ thông qua API đã được ghi nhận</li>
        <li>Mạo danh bất kỳ ai hoặc xuyên tạc mối liên kết của bạn</li>
        <li>Tải lên mã độc, virus hoặc nội dung có hại</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. Đăng Ký và Thanh Toán</h2>
      <p>
        Một số tính năng yêu cầu đăng ký trả phí. Thanh toán được xử lý bởi Stripe.
        Đăng ký sẽ tự động gia hạn trừ khi hủy trước ngày gia hạn.
        Hoàn tiền được xử lý theo từng trường hợp theo quyết định của chúng tôi.
        Chúng tôi có quyền thay đổi giá với thông báo trước 30 ngày.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. Nội Dung Do AI Tạo Ra</h2>
      <p>
        Dịch vụ sử dụng trí tuệ nhân tạo và mô hình ngôn ngữ lớn (bao gồm nhưng không giới hạn OpenAI GPT, Google Gemini và Anthropic Claude)
        để tạo phân tích, tóm tắt và khuyến nghị. Nội dung do AI tạo ra có thể không chính xác, thiên lệch hoặc gây hiểu lầm.
        Chúng tôi không đảm bảo chất lượng hoặc độ tin cậy của đầu ra AI.
        Bạn thừa nhận rằng mô hình AI có thể tạo ra kết quả khác nhau cho cùng một truy vấn và kết quả cần được xác minh độc lập.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. Giới Hạn Trách Nhiệm</h2>
      <p>
        TRONG PHẠM VI TỐI ĐA ĐƯỢC PHÁP LUẬT CHO PHÉP, CÔNG TY VÀ CÁC VIÊN CHỨC, GIÁM ĐỐC, NHÂN VIÊN VÀ ĐẠI DIỆN
        SẼ KHÔNG CHỊU TRÁCH NHIỆM VỀ BẤT KỲ THIỆT HẠI GIÁN TIẾP, NGẪU NHIÊN, ĐẶC BIỆT, HỆ QUẢ HOẶC MANG TÍNH TRỪNG PHẠT NÀO,
        BAO GỒM NHƯNG KHÔNG GIỚI HẠN MẤT LỢI NHUẬN, DỮ LIỆU, UY TÍN HOẶC TỔN THẤT ĐẦU TƯ,
        PHÁT SINH TỪ VIỆC BẠN SỬ DỤNG HOẶC KHÔNG THỂ SỬ DỤNG DỊCH VỤ.
      </p>
      <p>
        TỔNG TRÁCH NHIỆM CỦA CHÚNG TÔI CHO BẤT KỲ KHIẾU NẠI NÀO PHÁT SINH TỪ DỊCH VỤ SẼ KHÔNG VƯỢT QUÁ SỐ TIỀN BẠN ĐÃ TRẢ CHO CHÚNG TÔI TRONG 12 THÁNG TRƯỚC KHIẾU NẠI, HOẶC 100 AUD, TÙY THEO SỐ NÀO LỚN HƠN.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Bồi Thường</h2>
      <p>
        Bạn đồng ý bồi thường và giữ cho Công ty không bị tổn hại trước bất kỳ khiếu nại, thiệt hại, tổn thất hoặc chi phí nào
        phát sinh từ việc bạn sử dụng Dịch vụ, vi phạm các Điều khoản này hoặc xâm phạm quyền của bên thứ ba.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. Sở Hữu Trí Tuệ</h2>
      <p>
        Tất cả nội dung, nhãn hiệu, logo và sở hữu trí tuệ trên Dịch vụ thuộc sở hữu hoặc được cấp phép cho Công ty.
        Bạn không được sao chép, phân phối hoặc tạo tác phẩm phái sinh mà không có sự đồng ý bằng văn bản trước của chúng tôi.
        Việc sử dụng Dịch vụ không cấp cho bạn bất kỳ quyền sở hữu nào.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. Dữ Liệu và Quyền Riêng Tư</h2>
      <p>
        Việc sử dụng Dịch vụ cũng được điều chỉnh bởi {privacyLinks.vi} của chúng tôi.
        Chúng tôi thu thập và xử lý dữ liệu cá nhân như được mô tả trong đó.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. Dịch Vụ Bên Thứ Ba</h2>
      <p>
        Dịch vụ tích hợp với nhà cung cấp dữ liệu, bộ xử lý thanh toán và dịch vụ AI của bên thứ ba.
        Chúng tôi không chịu trách nhiệm về tính khả dụng, chính xác hoặc bảo mật của dịch vụ bên thứ ba.
        Việc sử dụng dịch vụ bên thứ ba tuân theo các điều khoản và điều kiện tương ứng của họ.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. Chấm Dứt</h2>
      <p>
        Chúng tôi có thể tạm ngưng hoặc chấm dứt tài khoản của bạn bất cứ lúc nào do vi phạm các Điều khoản hoặc vì bất kỳ lý do nào theo quyết định của chúng tôi.
        Bạn có thể đóng tài khoản bất cứ lúc nào bằng cách liên hệ info@datap.ai.
        Khi chấm dứt, quyền sử dụng Dịch vụ của bạn sẽ ngừng ngay lập tức.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. Luật Áp Dụng</h2>
      <p>
        Các Điều khoản này được điều chỉnh bởi luật pháp của New South Wales, Úc.
        Mọi tranh chấp sẽ thuộc thẩm quyền xét xử độc quyền của tòa án New South Wales.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. Thay Đổi Điều Khoản</h2>
      <p>
        Chúng tôi có thể cập nhật các Điều khoản này theo thời gian. Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trong ứng dụng.
        Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi đồng nghĩa với việc chấp nhận các Điều khoản đã cập nhật.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. Liên Hệ</h2>
      <p>
        Cho các câu hỏi về Điều khoản này, liên hệ:<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        Email: {EMAIL_LINK}<br />
        Điện thoại: 0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   THAI (th)
   ================================================================ */
function TermsTH() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">ข้อกำหนดการให้บริการ</h1>
      <p className="text-gray-400 text-sm mb-8">อัปเดตล่าสุด: มีนาคม 2026</p>
      <Disclaimer lang="th" />

      <p>
        ยินดีต้อนรับสู่ DataP.ai (&quot;บริการ&quot;) ดำเนินงานโดย AWSME Pty Ltd (ABN อยู่ระหว่างดำเนินการ), Suite 2/200 Mona Vale Rd, St Ives NSW 2075, ออสเตรเลีย (&quot;บริษัท&quot;, &quot;เรา&quot;)
        การเข้าถึงหรือใช้บริการของเราถือว่าคุณตกลงที่จะผูกพันตามข้อกำหนดเหล่านี้
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. คำอธิบายบริการ</h2>
      <p>
        DataP.ai ให้บริการเครื่องมือวิจัย วิเคราะห์ และข่าวกรองตลาดหุ้นที่ขับเคลื่อนด้วย AI ครอบคลุมตลาดหลักทรัพย์ทั่วโลกหลายแห่ง
        บริการของเราประกอบด้วยแต่ไม่จำกัดเฉพาะ: สัญญาณการวิเคราะห์ทางเทคนิค การให้คะแนนการวิเคราะห์ปัจจัยพื้นฐาน
        การติดตามหน้านักลงทุนสัมพันธ์ แชทผู้ช่วย AI เครื่องมือคัดกรอง และระบบแจ้งเตือน
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. ไม่ใช่คำแนะนำทางการเงิน</h2>
      <p className="font-semibold text-red-700">
        บริการนี้มีไว้เพื่อวัตถุประสงค์ในการให้ข้อมูลและการศึกษาเท่านั้น
        ไม่มีสิ่งใดบนแพลตฟอร์มนี้ที่ถือเป็นคำแนะนำทางการเงิน การลงทุน กฎหมาย หรือภาษี
      </p>
      <p>
        เนื้อหาที่สร้างโดย AI ทั้งหมด สัญญาณ คะแนน คำแนะนำ (รวมถึงแต่ไม่จำกัดเฉพาะสัญญาณ ซื้อ ขาย ถือ ซื้อแรง ขายแรง)
        คะแนนความเชื่อมั่น และการวิเคราะห์ ผลิตโดยระบบอัตโนมัติและโมเดลภาษาขนาดใหญ่
        อาจมีข้อผิดพลาด ภาพหลอน หรือข้อมูลที่ล้าสมัย คุณไม่ควรพึ่งพาสิ่งเหล่านี้เป็นพื้นฐานเดียวสำหรับการตัดสินใจลงทุน
      </p>
      <p>
        ควรปรึกษาที่ปรึกษาทางการเงินที่มีคุณสมบัติเสมอก่อนตัดสินใจลงทุน
        ผลการดำเนินงานในอดีตไม่รับประกันผลลัพธ์ในอนาคต การลงทุนทั้งหมดมีความเสี่ยง รวมถึงการสูญเสียเงินต้น
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. ไม่รับประกันความถูกต้อง</h2>
      <p>
        เราไม่รับประกันหรือรับรองเกี่ยวกับความถูกต้อง ความสมบูรณ์ ความทันเวลา หรือความน่าเชื่อถือของข้อมูล การวิเคราะห์ หรือเนื้อหาใด ๆ ที่ให้ผ่านบริการ
        ราคาหุ้น ข้อมูลทางการเงิน และข้อมูลตลาดมาจากผู้ให้บริการบุคคลที่สาม (รวมถึง Yahoo Finance, Polygon.io และอื่น ๆ)
        และอาจล่าช้า ไม่สมบูรณ์ หรือไม่ถูกต้อง เราไม่รับผิดชอบต่อข้อผิดพลาดหรือการละเว้นในข้อมูลของบุคคลที่สาม
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. การลงทะเบียนบัญชี</h2>
      <p>
        คุณต้องให้ข้อมูลที่ถูกต้องและครบถ้วนเมื่อสร้างบัญชี
        คุณรับผิดชอบในการรักษาความลับของข้อมูลรับรองการเข้าสู่ระบบและกิจกรรมทั้งหมดภายใต้บัญชีของคุณ
        คุณต้องมีอายุอย่างน้อย 18 ปี (หรือบรรลุนิติภาวะในเขตอำนาจศาลของคุณ) เพื่อใช้บริการ
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. การใช้งานที่ยอมรับได้</h2>
      <p>คุณตกลงที่จะไม่:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>ใช้บริการเพื่อวัตถุประสงค์ที่ผิดกฎหมายหรือเพื่ออำนวยความสะดวกในการปั่นตลาด การซื้อขายภายใน หรือการฉ้อโกง</li>
        <li>เก็บรวบรวม คัดลอก แจกจ่ายซ้ำ หรือใช้ประโยชน์เชิงพาณิชย์จากเนื้อหาหรือข้อมูลจากบริการโดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรล่วงหน้า</li>
        <li>พยายามหลีกเลี่ยงมาตรการรักษาความปลอดภัย ขีดจำกัดอัตรา หรือการควบคุมการเข้าถึง</li>
        <li>ใช้เครื่องมืออัตโนมัติ (บอท, ครอว์เลอร์) เพื่อเข้าถึงบริการ ยกเว้นผ่าน API ที่บันทึกไว้ของเรา</li>
        <li>แอบอ้างเป็นบุคคลอื่นหรือบิดเบือนความเกี่ยวข้องของคุณ</li>
        <li>อัปโหลดโค้ดที่เป็นอันตราย ไวรัส หรือเนื้อหาที่เป็นอันตราย</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. การสมัครสมาชิกและการชำระเงิน</h2>
      <p>
        คุณสมบัติบางอย่างต้องสมัครสมาชิกแบบชำระเงิน การชำระเงินประมวลผลโดย Stripe
        การสมัครสมาชิกจะต่ออายุอัตโนมัติเว้นแต่จะยกเลิกก่อนวันต่ออายุ
        การคืนเงินจะพิจารณาเป็นรายกรณีตามดุลยพินิจของเรา
        เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงราคาโดยแจ้งให้ทราบล่วงหน้า 30 วัน
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. เนื้อหาที่สร้างโดย AI</h2>
      <p>
        บริการใช้ปัญญาประดิษฐ์และโมเดลภาษาขนาดใหญ่ (รวมถึงแต่ไม่จำกัดเฉพาะ OpenAI GPT, Google Gemini และ Anthropic Claude)
        เพื่อสร้างการวิเคราะห์ บทสรุป และคำแนะนำ เนื้อหาที่สร้างโดย AI อาจไม่ถูกต้อง มีอคติ หรือทำให้เข้าใจผิด
        เราไม่รับประกันคุณภาพหรือความน่าเชื่อถือของผลลัพธ์จาก AI
        คุณรับทราบว่าโมเดล AI อาจสร้างผลลัพธ์ที่แตกต่างกันสำหรับคำค้นเดียวกัน และผลลัพธ์ควรได้รับการตรวจสอบอย่างอิสระ
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. ข้อจำกัดความรับผิด</h2>
      <p>
        ภายในขอบเขตสูงสุดที่กฎหมายอนุญาต บริษัทและเจ้าหน้าที่ กรรมการ พนักงาน และตัวแทน
        จะไม่รับผิดชอบต่อความเสียหายทางอ้อม โดยบังเอิญ พิเศษ ที่เป็นผลสืบเนื่อง หรือเชิงลงโทษ
        รวมถึงแต่ไม่จำกัดเฉพาะการสูญเสียกำไร ข้อมูล ค่าความนิยม หรือการสูญเสียการลงทุน
        ที่เกิดจากการใช้หรือไม่สามารถใช้บริการของคุณ
      </p>
      <p>
        ความรับผิดทั้งหมดของเราสำหรับข้อเรียกร้องใด ๆ ที่เกิดจากบริการจะไม่เกินจำนวนเงินที่คุณจ่ายให้เราใน 12 เดือนก่อนข้อเรียกร้อง
        หรือ 100 ดอลลาร์ออสเตรเลีย แล้วแต่จำนวนใดมากกว่า
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. การชดใช้ค่าเสียหาย</h2>
      <p>
        คุณตกลงที่จะชดใช้ค่าเสียหายและปกป้องบริษัทจากข้อเรียกร้อง ความเสียหาย การสูญเสีย หรือค่าใช้จ่ายใด ๆ
        ที่เกิดจากการใช้บริการ การละเมิดข้อกำหนดเหล่านี้ หรือการละเมิดสิทธิ์ของบุคคลที่สาม
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. ทรัพย์สินทางปัญญา</h2>
      <p>
        เนื้อหา เครื่องหมายการค้า โลโก้ และทรัพย์สินทางปัญญาทั้งหมดบนบริการเป็นของหรือได้รับอนุญาตให้แก่บริษัท
        คุณไม่สามารถทำซ้ำ แจกจ่าย หรือสร้างผลงานลอกเลียนได้โดยไม่ได้รับความยินยอมเป็นลายลักษณ์อักษรจากเรา
        การใช้บริการไม่ได้ให้สิทธิ์ความเป็นเจ้าของแก่คุณ
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. ข้อมูลและความเป็นส่วนตัว</h2>
      <p>
        การใช้บริการของคุณยังอยู่ภายใต้{privacyLinks.th}ของเรา
        เราเก็บรวบรวมและประมวลผลข้อมูลส่วนบุคคลตามที่อธิบายไว้ในนั้น
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. บริการของบุคคลที่สาม</h2>
      <p>
        บริการนี้รวมเข้ากับผู้ให้บริการข้อมูล ผู้ประมวลผลการชำระเงิน และบริการ AI ของบุคคลที่สาม
        เราไม่รับผิดชอบต่อความพร้อมใช้งาน ความถูกต้อง หรือความปลอดภัยของบริการบุคคลที่สาม
        การใช้บริการบุคคลที่สามของคุณอยู่ภายใต้ข้อกำหนดและเงื่อนไขที่เกี่ยวข้อง
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. การยกเลิก</h2>
      <p>
        เราอาจระงับหรือยกเลิกบัญชีของคุณได้ตลอดเวลาสำหรับการละเมิดข้อกำหนดเหล่านี้หรือด้วยเหตุผลอื่นใดตามดุลยพินิจของเรา
        คุณสามารถปิดบัญชีได้ตลอดเวลาโดยติดต่อ info@datap.ai
        เมื่อยกเลิก สิทธิ์ในการใช้บริการของคุณจะสิ้นสุดลงทันที
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. กฎหมายที่ใช้บังคับ</h2>
      <p>
        ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายของนิวเซาท์เวลส์ ออสเตรเลีย
        ข้อพิพาทใด ๆ จะอยู่ภายใต้เขตอำนาจศาลเฉพาะของศาลนิวเซาท์เวลส์
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. การเปลี่ยนแปลงข้อกำหนด</h2>
      <p>
        เราอาจอัปเดตข้อกำหนดเหล่านี้เป็นครั้งคราว การเปลี่ยนแปลงสำคัญจะแจ้งผ่านอีเมลหรือการแจ้งเตือนในแอป
        การใช้บริการต่อเนื่องหลังการเปลี่ยนแปลงถือเป็นการยอมรับข้อกำหนดที่อัปเดต
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. ติดต่อ</h2>
      <p>
        สำหรับคำถามเกี่ยวกับข้อกำหนดเหล่านี้ ติดต่อ:<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        อีเมล: {EMAIL_LINK}<br />
        โทรศัพท์: 0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   MALAY (ms)
   ================================================================ */
function TermsMS() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">Terma Perkhidmatan</h1>
      <p className="text-gray-400 text-sm mb-8">Kemas kini terakhir: Mac 2026</p>
      <Disclaimer lang="ms" />

      <p>
        Selamat datang ke DataP.ai (&quot;Perkhidmatan&quot;), dikendalikan oleh AWSME Pty Ltd (ABN dalam proses), Suite 2/200 Mona Vale Rd, St Ives NSW 2075, Australia (&quot;Syarikat&quot;, &quot;kami&quot;).
        Dengan mengakses atau menggunakan Perkhidmatan kami, anda bersetuju untuk terikat dengan Terma ini.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. Penerangan Perkhidmatan</h2>
      <p>
        DataP.ai menyediakan alat penyelidikan, analisis dan risikan pasaran saham berkuasa AI yang meliputi pelbagai bursa global.
        Perkhidmatan kami termasuk tetapi tidak terhad kepada: isyarat analisis teknikal, pemarkahan analisis asas,
        pemantauan halaman hubungan pelabur, sembang pembantu AI, alat penyaringan dan sistem amaran.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. Bukan Nasihat Kewangan</h2>
      <p className="font-semibold text-red-700">
        PERKHIDMATAN INI ADALAH UNTUK TUJUAN MAKLUMAT DAN PENDIDIKAN SAHAJA.
        TIADA APA-APA DI PLATFORM INI YANG MERUPAKAN NASIHAT KEWANGAN, PELABURAN, UNDANG-UNDANG ATAU CUKAI.
      </p>
      <p>
        Semua kandungan yang dijana AI, isyarat, skor, cadangan (termasuk tetapi tidak terhad kepada isyarat BELI, JUAL, PEGANG, BELI KUAT, JUAL KUAT),
        skor keyakinan dan analisis dihasilkan oleh sistem automatik dan model bahasa besar.
        Ia mungkin mengandungi kesilapan, halusinasi atau maklumat lapuk. Anda tidak sepatutnya bergantung padanya sebagai asas tunggal untuk sebarang keputusan pelaburan.
      </p>
      <p>
        Sentiasa berunding dengan penasihat kewangan yang berkelayakan sebelum membuat keputusan pelaburan.
        Prestasi lepas tidak menjamin keputusan masa hadapan. Semua pelaburan membawa risiko, termasuk potensi kehilangan modal.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">3. Tiada Jaminan Ketepatan</h2>
      <p>
        Kami tidak membuat sebarang waranti atau representasi mengenai ketepatan, kesempurnaan, ketepatan masa atau kebolehpercayaan mana-mana data, analisis atau kandungan yang disediakan melalui Perkhidmatan.
        Harga saham, data kewangan dan maklumat pasaran diperoleh daripada pembekal pihak ketiga (termasuk Yahoo Finance, Polygon.io dan lain-lain)
        dan mungkin lewat, tidak lengkap atau tidak tepat. Kami tidak bertanggungjawab terhadap kesilapan atau peninggalan dalam data pihak ketiga.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. Pendaftaran Akaun</h2>
      <p>
        Anda mesti memberikan maklumat yang tepat dan lengkap semasa membuat akaun.
        Anda bertanggungjawab untuk mengekalkan kerahsiaan kelayakan log masuk anda dan semua aktiviti di bawah akaun anda.
        Anda mestilah berumur sekurang-kurangnya 18 tahun (atau umur dewasa di bidang kuasa anda) untuk menggunakan Perkhidmatan.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. Penggunaan Yang Boleh Diterima</h2>
      <p>Anda bersetuju untuk tidak:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Menggunakan Perkhidmatan untuk sebarang tujuan yang menyalahi undang-undang atau untuk memudahkan manipulasi pasaran, dagangan orang dalam atau penipuan</li>
        <li>Mengikis, menyalin, mengedar semula atau mengeksploitasi secara komersial sebarang kandungan atau data daripada Perkhidmatan tanpa persetujuan bertulis terlebih dahulu</li>
        <li>Cuba memintas langkah keselamatan, had kadar atau kawalan akses</li>
        <li>Menggunakan alat automatik (bot, perayap) untuk mengakses Perkhidmatan kecuali melalui API yang didokumenkan</li>
        <li>Menyamar sebagai mana-mana orang atau menyalahnyatakan gabungan anda</li>
        <li>Memuat naik kod berniat jahat, virus atau kandungan berbahaya</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">6. Langganan dan Pembayaran</h2>
      <p>
        Ciri tertentu memerlukan langganan berbayar. Pembayaran diproses oleh Stripe.
        Langganan diperbaharui secara automatik melainkan dibatalkan sebelum tarikh pembaharuan.
        Bayaran balik diuruskan secara kes demi kes mengikut budi bicara kami.
        Kami berhak menukar harga dengan notis 30 hari.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. Kandungan Yang Dijana AI</h2>
      <p>
        Perkhidmatan menggunakan kecerdasan buatan dan model bahasa besar (termasuk tetapi tidak terhad kepada OpenAI GPT, Google Gemini dan Anthropic Claude)
        untuk menjana analisis, ringkasan dan cadangan. Kandungan yang dijana AI mungkin tidak tepat, berat sebelah atau mengelirukan.
        Kami tidak menjamin kualiti atau kebolehpercayaan output AI.
        Anda mengakui bahawa model AI mungkin menghasilkan keputusan berbeza untuk pertanyaan yang sama dan keputusan harus disahkan secara bebas.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. Had Liabiliti</h2>
      <p>
        SETAKAT MAKSIMUM YANG DIBENARKAN OLEH UNDANG-UNDANG, SYARIKAT DAN PEGAWAI, PENGARAH, PEKERJA DAN EJENNYA
        TIDAK AKAN BERTANGGUNGJAWAB TERHADAP SEBARANG KEROSAKAN TIDAK LANGSUNG, SAMPINGAN, KHAS, BERBANGKIT ATAU PUNITIF,
        TERMASUK TETAPI TIDAK TERHAD KEPADA KEHILANGAN KEUNTUNGAN, DATA, MUHIBAH ATAU KERUGIAN PELABURAN,
        YANG TIMBUL DARIPADA PENGGUNAAN ATAU KETIDAKUPAYAAN MENGGUNAKAN PERKHIDMATAN.
      </p>
      <p>
        JUMLAH LIABILITI KAMI UNTUK SEBARANG TUNTUTAN YANG TIMBUL DARIPADA PERKHIDMATAN TIDAK AKAN MELEBIHI JUMLAH YANG ANDA BAYAR KEPADA KAMI DALAM 12 BULAN SEBELUM TUNTUTAN, ATAU AUD $100, YANG MANA LEBIH BESAR.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Ganti Rugi</h2>
      <p>
        Anda bersetuju untuk menanggung rugi dan membebaskan Syarikat daripada sebarang tuntutan, kerosakan, kerugian atau perbelanjaan
        yang timbul daripada penggunaan Perkhidmatan, pelanggaran Terma ini atau pelanggaran hak pihak ketiga.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. Harta Intelek</h2>
      <p>
        Semua kandungan, tanda dagangan, logo dan harta intelek pada Perkhidmatan adalah milik atau dilesenkan kepada Syarikat.
        Anda tidak boleh mengeluarkan semula, mengedar atau mencipta karya terbitan tanpa persetujuan bertulis terlebih dahulu.
        Penggunaan Perkhidmatan tidak memberikan anda sebarang hak pemilikan.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. Data dan Privasi</h2>
      <p>
        Penggunaan Perkhidmatan anda juga dikawal oleh {privacyLinks.ms} kami.
        Kami mengumpul dan memproses data peribadi seperti yang dinyatakan di dalamnya.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. Perkhidmatan Pihak Ketiga</h2>
      <p>
        Perkhidmatan berintegrasi dengan pembekal data pihak ketiga, pemproses pembayaran dan perkhidmatan AI.
        Kami tidak bertanggungjawab terhadap ketersediaan, ketepatan atau keselamatan perkhidmatan pihak ketiga.
        Penggunaan perkhidmatan pihak ketiga tertakluk kepada terma dan syarat masing-masing.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. Penamatan</h2>
      <p>
        Kami boleh menggantung atau menamatkan akaun anda pada bila-bila masa kerana melanggar Terma ini atau atas sebab lain mengikut budi bicara kami.
        Anda boleh menutup akaun pada bila-bila masa dengan menghubungi info@datap.ai.
        Selepas penamatan, hak anda untuk menggunakan Perkhidmatan terhenti serta-merta.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">14. Undang-undang Pentadbiran</h2>
      <p>
        Terma ini ditadbir oleh undang-undang New South Wales, Australia.
        Sebarang pertikaian akan tertakluk kepada bidang kuasa eksklusif mahkamah New South Wales.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">15. Perubahan Terma</h2>
      <p>
        Kami mungkin mengemaskini Terma ini dari semasa ke semasa. Perubahan penting akan dimaklumkan melalui emel atau notifikasi dalam aplikasi.
        Penggunaan berterusan Perkhidmatan selepas perubahan bermaksud penerimaan Terma yang dikemaskini.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">16. Hubungi Kami</h2>
      <p>
        Untuk pertanyaan mengenai Terma ini, hubungi:<br />
        <strong>AWSME Pty Ltd</strong><br />
        Suite 2/200 Mona Vale Rd, St Ives NSW 2075<br />
        Emel: {EMAIL_LINK}<br />
        Telefon: 0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   EXPORT MAP
   ================================================================ */
export const termsContent: Record<string, ReactNode> = {
  en: <TermsEN />,
  zh: <TermsZH />,
  "zh-TW": <TermsZHTW />,
  ja: <TermsJA />,
  ko: <TermsKO />,
  vi: <TermsVI />,
  th: <TermsTH />,
  ms: <TermsMS />,
};
