import { ReactNode } from "react";

const EMAIL_LINK = (
  <a href="mailto:info@datap.ai" className="text-indigo-600 hover:underline">
    info@datap.ai
  </a>
);

const PRIVACY_LINK = "/privacy";

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

function Disclaimer({ lang }: { lang: string }) {
  if (lang === "en" || !disclaimers[lang]) return null;
  return (
    <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded px-4 py-2 text-sm mb-6">
      {disclaimers[lang]}{" "}
      <a href="/privacy?lang=en" className="underline">
        English version
      </a>
    </p>
  );
}

/* ================================================================
   ENGLISH
   ================================================================ */
function PrivacyEN() {
  return (
    <>
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

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 Device &amp; Technical Data</h3>
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

      <h2 className="text-xl font-bold mt-8 mb-3">3. AI &amp; Chat Data</h2>
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

      <h2 className="text-xl font-bold mt-8 mb-3">5. Data Sharing &amp; Disclosure</h2>
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
      <p>To exercise these rights, contact us at {EMAIL_LINK}.</p>

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
        Email: {EMAIL_LINK}<br />
        Phone: 0431 525 939
      </p>
    </>
  );
}

/* ================================================================
   SIMPLIFIED CHINESE (zh)
   ================================================================ */
function PrivacyZH() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">隐私政策</h1>
      <p className="text-gray-400 text-sm mb-8">最后更新：2026年3月</p>
      <Disclaimer lang="zh" />

      <p>
        AWSME Pty Ltd（以下简称"公司"、"我们"）运营 DataP.ai（以下简称"服务"）。
        本隐私政策说明我们在您使用服务时如何收集、使用、披露和保护您的个人信息。
        使用本服务即表示您同意本政策所述的做法。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. 我们收集的信息</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 账户信息</h3>
      <p>注册时，我们收集：电子邮件地址和加密密码（PBKDF2 哈希——我们从不存储明文密码）。</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 投资者档案</h3>
      <p>
        如果您完成了入门向导，我们将收集：风险承受能力、投资期限、偏好策略、
        偏好交易所、偏好行业、投资组合规模范围、分析偏好和回复风格。
        这些数据仅用于个性化您的体验。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 使用数据</h3>
      <p>
        我们收集有关您如何使用服务的信息，包括：访问的页面、分析的股票、
        与 AI 助手的聊天消息、自选列表选择和功能使用情况。
        聊天记录会被保存以提供对话历史并改善我们的 AI 模型。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 设备和技术数据</h3>
      <p>
        我们通过标准 Web 服务器日志和分析工具自动收集：浏览器类型、操作系统、IP 地址、
        引荐 URL 和会话持续时间。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 支付信息</h3>
      <p>
        支付处理由 Stripe 负责。我们不会在服务器上存储信用卡号、银行账户详细信息或其他敏感金融信息。
        我们仅存储您的 Stripe 客户 ID 和订阅状态。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 我们如何使用您的信息</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>提供和个性化服务（根据您的档案定制 AI 生成的分析）</li>
        <li>处理付款和管理订阅</li>
        <li>发送与服务相关的通信（账户验证、安全警报、订阅更新）</li>
        <li>改善我们的 AI 模型和分析质量</li>
        <li>监控和防止欺诈、滥用和安全威胁</li>
        <li>遵守法律义务</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. AI 和聊天数据</h2>
      <p>
        您与 AI 助手的对话存储在我们的数据库中，以提供对话历史记录并提取改善未来响应的偏好
        （例如，记住您的风险承受能力）。我们可能会使用匿名和汇总的聊天数据来改善我们的 AI 模型。
        除第 5 节所述外，我们不会与第三方共享您的个人聊天内容。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. 与 AI 提供商的数据共享</h2>
      <p>
        为生成 AI 响应，我们会将您的查询和相关上下文发送给第三方 AI 提供商，包括：
        Google（Gemini）、OpenAI（GPT）和 Anthropic（Claude）。
        这些提供商根据其各自的隐私政策和数据处理协议处理您的数据。
        我们不会向 AI 提供商发送您的电子邮件地址、密码或支付信息。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. 数据共享与披露</h2>
      <p>我们可能与以下方共享您的信息：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>服务提供商：</strong>Stripe（支付）、Google Cloud（托管）、AI 模型提供商（如上所述）</li>
        <li><strong>法律合规：</strong>法律、法院命令或政府法规要求时</li>
        <li><strong>业务转让：</strong>与合并、收购或资产出售相关时</li>
        <li><strong>经您同意：</strong>当您明确授权共享时</li>
      </ul>
      <p>我们不会为营销目的向第三方出售您的个人信息。</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. 数据安全</h2>
      <p>
        我们采取行业标准的安全措施，包括：加密密码（PBKDF2）、传输中的 HTTPS 加密、
        安全的会话管理和访问控制。但是，互联网上没有任何传输方式是 100% 安全的。
        我们无法保证您数据的绝对安全。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. 数据保留</h2>
      <p>
        只要您的账户处于活跃状态，我们就会保留您的账户数据。
        聊天记录将无限期保留以提供对话连续性。
        如果您删除账户，我们将在 30 天内删除您的个人数据，
        法律要求或合法商业目的所需的保留除外。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. 您的权利</h2>
      <p>根据您所在的司法管辖区，您可能有权：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>访问您的个人数据</li>
        <li>更正不准确的数据</li>
        <li>请求删除您的数据（"被遗忘权"）</li>
        <li>以可移植格式导出您的数据</li>
        <li>反对或限制某些处理</li>
        <li>在基于同意的处理中撤回同意</li>
      </ul>
      <p>如需行使这些权利，请联系 {EMAIL_LINK}。</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Cookie</h2>
      <p>
        我们使用必要的 Cookie 进行身份验证（会话令牌）和语言偏好。
        我们不使用广告或跟踪 Cookie。
        第三方分析工具可能会根据其隐私政策设置自己的 Cookie。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 国际数据传输</h2>
      <p>
        我们的服务器托管在澳大利亚（AWS 悉尼区域）。
        您的数据可能由美国和其他司法管辖区的 AI 提供商处理。
        使用本服务即表示您同意将数据传输到这些司法管辖区，
        这些地区的数据保护标准可能与您居住国不同。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. 儿童</h2>
      <p>
        本服务不面向 18 岁以下的用户。
        我们不会故意收集儿童的个人信息。
        如果我们发现已收集儿童的数据，我们将立即删除。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 本政策的变更</h2>
      <p>
        我们可能会不时更新本隐私政策。
        重大变更将通过电子邮件或应用内通知告知。
        继续使用本服务即表示接受更新后的政策。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. 联系方式</h2>
      <p>
        如有隐私相关问题：<br />
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
function PrivacyZHTW() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">隱私政策</h1>
      <p className="text-gray-400 text-sm mb-8">最後更新：2026年3月</p>
      <Disclaimer lang="zh-TW" />

      <p>
        AWSME Pty Ltd（以下簡稱「公司」、「我們」）營運 DataP.ai（以下簡稱「服務」）。
        本隱私政策說明我們在您使用服務時如何收集、使用、揭露和保護您的個人資訊。
        使用本服務即表示您同意本政策所述的做法。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. 我們收集的資訊</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 帳戶資訊</h3>
      <p>註冊時，我們收集：電子郵件地址和加密密碼（PBKDF2 雜湊——我們從不儲存明文密碼）。</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 投資者檔案</h3>
      <p>
        如果您完成了入門精靈，我們將收集：風險承受能力、投資期限、偏好策略、
        偏好交易所、偏好產業、投資組合規模範圍、分析偏好和回覆風格。
        這些資料僅用於個人化您的體驗。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 使用資料</h3>
      <p>
        我們收集有關您如何使用服務的資訊，包括：造訪的頁面、分析的股票、
        與 AI 助手的聊天訊息、自選清單選擇和功能使用情況。
        聊天記錄會被保存以提供對話歷史並改善我們的 AI 模型。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 裝置和技術資料</h3>
      <p>
        我們透過標準 Web 伺服器日誌和分析工具自動收集：瀏覽器類型、作業系統、IP 位址、
        引薦 URL 和工作階段持續時間。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 付款資訊</h3>
      <p>
        付款處理由 Stripe 負責。我們不會在伺服器上儲存信用卡號、銀行帳戶詳細資訊或其他敏感金融資訊。
        我們僅儲存您的 Stripe 客戶 ID 和訂閱狀態。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 我們如何使用您的資訊</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>提供和個人化服務（根據您的檔案量身定制 AI 生成的分析）</li>
        <li>處理付款和管理訂閱</li>
        <li>發送與服務相關的通訊（帳戶驗證、安全警報、訂閱更新）</li>
        <li>改善我們的 AI 模型和分析品質</li>
        <li>監控和防止詐欺、濫用和安全威脅</li>
        <li>遵守法律義務</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. AI 和聊天資料</h2>
      <p>
        您與 AI 助手的對話儲存在我們的資料庫中，以提供對話歷史記錄並擷取改善未來回應的偏好
        （例如，記住您的風險承受能力）。我們可能會使用匿名和彙總的聊天資料來改善我們的 AI 模型。
        除第 5 節所述外，我們不會與第三方分享您的個人聊天內容。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. 與 AI 提供商的資料共享</h2>
      <p>
        為生成 AI 回應，我們會將您的查詢和相關上下文傳送給第三方 AI 提供商，包括：
        Google（Gemini）、OpenAI（GPT）和 Anthropic（Claude）。
        這些提供商根據其各自的隱私政策和資料處理協議處理您的資料。
        我們不會向 AI 提供商傳送您的電子郵件地址、密碼或付款資訊。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. 資料共享與揭露</h2>
      <p>我們可能與以下方分享您的資訊：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>服務提供商：</strong>Stripe（付款）、Google Cloud（託管）、AI 模型提供商（如上所述）</li>
        <li><strong>法律合規：</strong>法律、法院命令或政府法規要求時</li>
        <li><strong>業務轉讓：</strong>與合併、收購或資產出售相關時</li>
        <li><strong>經您同意：</strong>當您明確授權分享時</li>
      </ul>
      <p>我們不會為行銷目的向第三方出售您的個人資訊。</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. 資料安全</h2>
      <p>
        我們採取業界標準的安全措施，包括：加密密碼（PBKDF2）、傳輸中的 HTTPS 加密、
        安全的工作階段管理和存取控制。但是，網際網路上沒有任何傳輸方式是 100% 安全的。
        我們無法保證您資料的絕對安全。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. 資料保留</h2>
      <p>
        只要您的帳戶處於活躍狀態，我們就會保留您的帳戶資料。
        聊天記錄將無限期保留以提供對話連續性。
        如果您刪除帳戶，我們將在 30 天內刪除您的個人資料，
        法律要求或合法商業目的所需的保留除外。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. 您的權利</h2>
      <p>根據您所在的司法管轄區，您可能有權：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>存取您的個人資料</li>
        <li>更正不準確的資料</li>
        <li>請求刪除您的資料（「被遺忘權」）</li>
        <li>以可攜式格式匯出您的資料</li>
        <li>反對或限制某些處理</li>
        <li>在基於同意的處理中撤回同意</li>
      </ul>
      <p>如需行使這些權利，請聯繫 {EMAIL_LINK}。</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Cookie</h2>
      <p>
        我們使用必要的 Cookie 進行身份驗證（工作階段權杖）和語言偏好。
        我們不使用廣告或追蹤 Cookie。
        第三方分析工具可能會根據其隱私政策設定自己的 Cookie。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 國際資料傳輸</h2>
      <p>
        我們的伺服器託管在澳洲（AWS 雪梨區域）。
        您的資料可能由美國和其他司法管轄區的 AI 提供商處理。
        使用本服務即表示您同意將資料傳輸到這些司法管轄區，
        這些地區的資料保護標準可能與您居住國不同。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. 兒童</h2>
      <p>
        本服務不面向 18 歲以下的使用者。
        我們不會故意收集兒童的個人資訊。
        如果我們發現已收集兒童的資料，我們將立即刪除。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 本政策的變更</h2>
      <p>
        我們可能會不時更新本隱私政策。
        重大變更將透過電子郵件或應用程式內通知告知。
        繼續使用本服務即表示接受更新後的政策。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. 聯絡方式</h2>
      <p>
        如有隱私相關問題：<br />
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
function PrivacyJA() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">プライバシーポリシー</h1>
      <p className="text-gray-400 text-sm mb-8">最終更新：2026年3月</p>
      <Disclaimer lang="ja" />

      <p>
        AWSME Pty Ltd（以下「当社」）は DataP.ai（以下「本サービス」）を運営しています。
        本プライバシーポリシーは、お客様が本サービスを利用する際に、当社がお客様の個人情報をどのように収集、
        使用、開示、保護するかを説明するものです。本サービスを利用することにより、
        本ポリシーに記載された慣行に同意したものとみなされます。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. 収集する情報</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 アカウント情報</h3>
      <p>登録時に、メールアドレスと暗号化されたパスワード（PBKDF2ハッシュ化——平文パスワードは保存しません）を収集します。</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 投資家プロフィール</h3>
      <p>
        オンボーディングウィザードを完了した場合、リスク許容度、投資期間、好みの戦略、
        好みの取引所、好みのセクター、ポートフォリオ規模の範囲、分析の好み、
        回答スタイルを収集します。このデータはお客様の体験をパーソナライズするためにのみ使用されます。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 利用データ</h3>
      <p>
        閲覧したページ、分析した銘柄、AIコパイロットとのチャットメッセージ、
        ウォッチリストの選択、機能の利用状況など、お客様のサービス利用に関する情報を収集します。
        チャットの会話履歴は、対話履歴の提供とAIモデルの改善のために保存されます。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 デバイスおよび技術データ</h3>
      <p>
        標準的なWebサーバーログと分析ツールを通じて、ブラウザの種類、オペレーティングシステム、
        IPアドレス、参照URL、セッション時間を自動的に収集します。
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 支払い情報</h3>
      <p>
        支払い処理はStripeが行います。当社のサーバーにクレジットカード番号、銀行口座の詳細、
        その他の機密金融情報を保存することはありません。StripeカスタマーIDとサブスクリプション状態のみを保存します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 情報の利用方法</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>サービスの提供とパーソナライズ（お客様のプロフィールに合わせたAI生成分析）</li>
        <li>支払い処理とサブスクリプション管理</li>
        <li>サービス関連の通信の送信（アカウント確認、セキュリティアラート、サブスクリプション更新）</li>
        <li>AIモデルと分析品質の改善</li>
        <li>詐欺、不正使用、セキュリティ脅威の監視と防止</li>
        <li>法的義務の遵守</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. AIおよびチャットデータ</h2>
      <p>
        AIコパイロットとの会話は、対話履歴の提供と将来の回答を改善するための設定の抽出
        （例：リスク許容度の記憶）のためにデータベースに保存されます。
        匿名化および集約されたチャットデータをAIモデルの改善に使用する場合があります。
        第5条に記載されている場合を除き、個別のチャット内容を第三者と共有することはありません。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. AIプロバイダーとのデータ共有</h2>
      <p>
        AI応答を生成するために、お客様のクエリと関連するコンテキストをGoogle（Gemini）、
        OpenAI（GPT）、Anthropic（Claude）などのサードパーティAIプロバイダーに送信します。
        これらのプロバイダーは、それぞれのプライバシーポリシーおよびデータ処理契約に従ってデータを処理します。
        メールアドレス、パスワード、支払い情報をAIプロバイダーに送信することはありません。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. データの共有と開示</h2>
      <p>以下の相手とお客様の情報を共有する場合があります：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>サービスプロバイダー：</strong>Stripe（支払い）、Google Cloud（ホスティング）、AIモデルプロバイダー（上記の通り）</li>
        <li><strong>法的遵守：</strong>法律、裁判所命令、または政府規制により要求された場合</li>
        <li><strong>事業譲渡：</strong>合併、買収、または資産売却に関連する場合</li>
        <li><strong>お客様の同意：</strong>共有を明示的に承認された場合</li>
      </ul>
      <p>マーケティング目的で個人情報を第三者に販売することはありません。</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. データセキュリティ</h2>
      <p>
        暗号化されたパスワード（PBKDF2）、転送中のHTTPS暗号化、安全なセッション管理、
        アクセス制御など、業界標準のセキュリティ対策を実施しています。
        ただし、インターネットを介した伝送方法は100%安全ではありません。
        データの絶対的なセキュリティを保証することはできません。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. データ保持</h2>
      <p>
        アカウントが有効な限り、アカウントデータを保持します。
        チャット履歴は会話の継続性を提供するために無期限に保持されます。
        アカウントを削除された場合、30日以内に個人データを削除します。
        ただし、法律で要求される場合や正当な事業目的のために必要な保持は除きます。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. お客様の権利</h2>
      <p>お客様の管轄区域に応じて、以下の権利を有する場合があります：</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>個人データへのアクセス</li>
        <li>不正確なデータの訂正</li>
        <li>データの削除の要求（「忘れられる権利」）</li>
        <li>ポータブル形式でのデータのエクスポート</li>
        <li>特定の処理への異議または制限</li>
        <li>同意に基づく処理における同意の撤回</li>
      </ul>
      <p>これらの権利を行使するには、{EMAIL_LINK} までご連絡ください。</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Cookie</h2>
      <p>
        認証（セッショントークン）と言語設定のために必要なCookieを使用しています。
        広告やトラッキングのCookieは使用していません。
        サードパーティの分析ツールは、それぞれのプライバシーポリシーに従って独自のCookieを設定する場合があります。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 国際データ転送</h2>
      <p>
        当社のサーバーはオーストラリア（AWSシドニーリージョン）でホストされています。
        お客様のデータは、米国およびその他の管轄区域のAIプロバイダーによって処理される場合があります。
        本サービスを利用することにより、お客様の居住国とは異なるデータ保護基準を持つ可能性のある
        これらの管轄区域へのデータ転送に同意したものとみなされます。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. 未成年者</h2>
      <p>
        本サービスは18歳未満のユーザーを対象としていません。
        児童の個人情報を故意に収集することはありません。
        児童からデータを収集したことが判明した場合、速やかに削除します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 本ポリシーの変更</h2>
      <p>
        本プライバシーポリシーは随時更新される場合があります。
        重要な変更はメールまたはアプリ内通知でお知らせします。
        本サービスの継続的な利用は、更新されたポリシーの承諾を意味します。
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. お問い合わせ</h2>
      <p>
        プライバシーに関するお問い合わせ：<br />
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
function PrivacyKO() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">개인정보 처리방침</h1>
      <p className="text-gray-400 text-sm mb-8">최종 업데이트: 2026년 3월</p>
      <Disclaimer lang="ko" />

      <p>
        AWSME Pty Ltd(이하 &quot;회사&quot;, &quot;당사&quot;)는 DataP.ai(이하 &quot;서비스&quot;)를 운영합니다.
        본 개인정보 처리방침은 귀하가 서비스를 이용할 때 당사가 귀하의 개인정보를 어떻게 수집, 사용,
        공개 및 보호하는지 설명합니다. 서비스를 이용함으로써 귀하는 본 방침에 기술된 관행에 동의하는 것으로 간주됩니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. 수집하는 정보</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 계정 정보</h3>
      <p>회원가입 시 이메일 주소와 암호화된 비밀번호(PBKDF2 해시 — 평문 비밀번호는 저장하지 않음)를 수집합니다.</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 투자자 프로필</h3>
      <p>
        온보딩 마법사를 완료하면 위험 허용도, 투자 기간, 선호 전략, 선호 거래소, 선호 섹터,
        포트폴리오 규모 범위, 분석 선호도 및 응답 스타일을 수집합니다.
        이 데이터는 귀하의 경험을 개인화하는 데에만 사용됩니다.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 이용 데이터</h3>
      <p>
        방문한 페이지, 분석한 종목, AI 코파일럿과의 채팅 메시지, 관심 목록 선택 및 기능 사용 현황 등
        서비스 이용에 관한 정보를 수집합니다. 채팅 대화는 대화 기록 제공 및 AI 모델 개선을 위해 저장됩니다.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 기기 및 기술 데이터</h3>
      <p>
        표준 웹 서버 로그 및 분석 도구를 통해 브라우저 유형, 운영 체제, IP 주소,
        참조 URL 및 세션 지속 시간을 자동으로 수집합니다.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 결제 정보</h3>
      <p>
        결제 처리는 Stripe가 담당합니다. 당사 서버에 신용카드 번호, 은행 계좌 정보 또는 기타 민감한 금융 정보를
        저장하지 않습니다. Stripe 고객 ID와 구독 상태만 저장합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. 정보 이용 방법</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>서비스 제공 및 개인화 (귀하의 프로필에 맞춘 AI 생성 분석)</li>
        <li>결제 처리 및 구독 관리</li>
        <li>서비스 관련 커뮤니케이션 발송 (계정 인증, 보안 알림, 구독 업데이트)</li>
        <li>AI 모델 및 분석 품질 개선</li>
        <li>사기, 남용 및 보안 위협 모니터링 및 방지</li>
        <li>법적 의무 준수</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. AI 및 채팅 데이터</h2>
      <p>
        AI 코파일럿과의 대화는 대화 기록 제공 및 향후 응답 개선을 위한 선호도 추출
        (예: 위험 허용도 기억)을 위해 데이터베이스에 저장됩니다. 익명화 및 집계된 채팅 데이터를
        AI 모델 개선에 사용할 수 있습니다. 제5조에 설명된 경우를 제외하고 개별 채팅 내용을
        제3자와 공유하지 않습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. AI 제공업체와의 데이터 공유</h2>
      <p>
        AI 응답을 생성하기 위해 귀하의 쿼리와 관련 컨텍스트를 Google(Gemini), OpenAI(GPT),
        Anthropic(Claude) 등의 제3자 AI 제공업체에 전송합니다. 이러한 제공업체는 각자의 개인정보
        처리방침 및 데이터 처리 계약에 따라 데이터를 처리합니다. 이메일 주소, 비밀번호 또는 결제 정보를
        AI 제공업체에 전송하지 않습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. 데이터 공유 및 공개</h2>
      <p>다음과 귀하의 정보를 공유할 수 있습니다:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>서비스 제공업체:</strong> Stripe(결제), Google Cloud(호스팅), AI 모델 제공업체(상기 기술)</li>
        <li><strong>법적 준수:</strong> 법률, 법원 명령 또는 정부 규제에 의해 요구되는 경우</li>
        <li><strong>사업 양도:</strong> 합병, 인수 또는 자산 매각과 관련된 경우</li>
        <li><strong>귀하의 동의:</strong> 귀하가 공유를 명시적으로 승인한 경우</li>
      </ul>
      <p>마케팅 목적으로 개인정보를 제3자에게 판매하지 않습니다.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. 데이터 보안</h2>
      <p>
        암호화된 비밀번호(PBKDF2), 전송 중 HTTPS 암호화, 안전한 세션 관리 및 접근 제어 등
        업계 표준 보안 조치를 시행하고 있습니다. 그러나 인터넷을 통한 전송 방법은 100% 안전하지 않습니다.
        데이터의 절대적인 보안을 보장할 수 없습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. 데이터 보유</h2>
      <p>
        계정이 활성 상태인 동안 계정 데이터를 보유합니다. 채팅 기록은 대화 연속성을 제공하기 위해
        무기한 보유됩니다. 계정을 삭제하면 30일 이내에 개인 데이터를 삭제합니다.
        단, 법률에 의해 요구되거나 정당한 사업 목적에 필요한 보유는 제외합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. 귀하의 권리</h2>
      <p>귀하의 관할권에 따라 다음의 권리를 가질 수 있습니다:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>개인 데이터에 대한 접근</li>
        <li>부정확한 데이터의 수정</li>
        <li>데이터 삭제 요청 (&quot;잊혀질 권리&quot;)</li>
        <li>이동 가능한 형식으로 데이터 내보내기</li>
        <li>특정 처리에 대한 이의 제기 또는 제한</li>
        <li>동의에 기반한 처리에서 동의 철회</li>
      </ul>
      <p>이러한 권리를 행사하려면 {EMAIL_LINK}로 문의하십시오.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. 쿠키</h2>
      <p>
        인증(세션 토큰) 및 언어 기본 설정을 위한 필수 쿠키를 사용합니다.
        광고 또는 추적 쿠키는 사용하지 않습니다.
        제3자 분석 도구는 자체 개인정보 처리방침에 따라 자체 쿠키를 설정할 수 있습니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. 국제 데이터 전송</h2>
      <p>
        당사 서버는 호주(AWS 시드니 리전)에서 호스팅됩니다. 귀하의 데이터는 미국 및 기타 관할권의
        AI 제공업체에 의해 처리될 수 있습니다. 서비스를 이용함으로써 귀하는 귀하의 거주 국가와 다른
        데이터 보호 기준을 가질 수 있는 이러한 관할권으로의 데이터 전송에 동의하는 것으로 간주됩니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. 미성년자</h2>
      <p>
        본 서비스는 18세 미만의 사용자를 대상으로 하지 않습니다.
        아동의 개인정보를 고의로 수집하지 않습니다.
        아동의 데이터를 수집한 것으로 확인되면 즉시 삭제합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. 본 방침의 변경</h2>
      <p>
        본 개인정보 처리방침은 수시로 업데이트될 수 있습니다.
        중요한 변경 사항은 이메일 또는 앱 내 알림을 통해 통지됩니다.
        서비스의 지속적인 이용은 업데이트된 방침의 수락을 의미합니다.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. 문의</h2>
      <p>
        개인정보 관련 문의:<br />
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
function PrivacyVI() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">Chính Sách Bảo Mật</h1>
      <p className="text-gray-400 text-sm mb-8">Cập nhật lần cuối: Tháng 3, 2026</p>
      <Disclaimer lang="vi" />

      <p>
        AWSME Pty Ltd (&quot;Công ty&quot;, &quot;chúng tôi&quot;) vận hành DataP.ai (&quot;Dịch vụ&quot;).
        Chính Sách Bảo Mật này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin cá nhân
        của bạn khi bạn sử dụng Dịch vụ. Bằng việc sử dụng Dịch vụ, bạn đồng ý với các thông lệ được mô tả trong đây.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. Thông Tin Chúng Tôi Thu Thập</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 Thông tin tài khoản</h3>
      <p>Khi đăng ký, chúng tôi thu thập: địa chỉ email và mật khẩu đã mã hóa (băm PBKDF2 — chúng tôi không bao giờ lưu trữ mật khẩu dạng văn bản thuần).</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 Hồ sơ nhà đầu tư</h3>
      <p>
        Nếu bạn hoàn thành trình hướng dẫn, chúng tôi thu thập: mức chấp nhận rủi ro, thời hạn đầu tư,
        chiến lược ưa thích, sàn giao dịch ưa thích, ngành ưa thích, phạm vi quy mô danh mục đầu tư,
        tùy chọn phân tích và phong cách phản hồi.
        Dữ liệu này chỉ được sử dụng để cá nhân hóa trải nghiệm của bạn.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 Dữ liệu sử dụng</h3>
      <p>
        Chúng tôi thu thập thông tin về cách bạn sử dụng Dịch vụ, bao gồm: trang đã truy cập, cổ phiếu đã phân tích,
        tin nhắn trò chuyện với trợ lý AI, lựa chọn danh mục theo dõi và tình hình sử dụng tính năng.
        Các cuộc trò chuyện được lưu trữ để cung cấp lịch sử hội thoại và cải thiện mô hình AI.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 Dữ liệu thiết bị và kỹ thuật</h3>
      <p>
        Chúng tôi tự động thu thập: loại trình duyệt, hệ điều hành, địa chỉ IP, URL giới thiệu và thời lượng phiên
        thông qua nhật ký máy chủ web tiêu chuẩn và công cụ phân tích.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 Thông tin thanh toán</h3>
      <p>
        Xử lý thanh toán do Stripe đảm nhận. Chúng tôi không lưu trữ số thẻ tín dụng, chi tiết tài khoản ngân hàng
        hoặc thông tin tài chính nhạy cảm khác trên máy chủ. Chúng tôi chỉ lưu trữ ID khách hàng Stripe và trạng thái đăng ký.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Cung cấp và cá nhân hóa Dịch vụ (phân tích AI được tùy chỉnh theo hồ sơ của bạn)</li>
        <li>Xử lý thanh toán và quản lý đăng ký</li>
        <li>Gửi thông tin liên lạc liên quan đến dịch vụ (xác minh tài khoản, cảnh báo bảo mật, cập nhật đăng ký)</li>
        <li>Cải thiện mô hình AI và chất lượng phân tích</li>
        <li>Giám sát và ngăn chặn gian lận, lạm dụng và mối đe dọa bảo mật</li>
        <li>Tuân thủ nghĩa vụ pháp lý</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. Dữ Liệu AI và Trò Chuyện</h2>
      <p>
        Các cuộc trò chuyện của bạn với trợ lý AI được lưu trữ trong cơ sở dữ liệu để cung cấp lịch sử hội thoại
        và trích xuất tùy chọn cải thiện phản hồi trong tương lai (ví dụ: ghi nhớ mức chấp nhận rủi ro).
        Chúng tôi có thể sử dụng dữ liệu trò chuyện ẩn danh và tổng hợp để cải thiện mô hình AI.
        Chúng tôi không chia sẻ nội dung trò chuyện cá nhân với bên thứ ba trừ khi được mô tả trong Mục 5.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. Chia Sẻ Dữ Liệu với Nhà Cung Cấp AI</h2>
      <p>
        Để tạo phản hồi AI, chúng tôi gửi truy vấn và ngữ cảnh liên quan đến nhà cung cấp AI bên thứ ba bao gồm:
        Google (Gemini), OpenAI (GPT) và Anthropic (Claude). Các nhà cung cấp này xử lý dữ liệu theo chính sách
        bảo mật và thỏa thuận xử lý dữ liệu tương ứng. Chúng tôi không gửi địa chỉ email, mật khẩu hoặc
        thông tin thanh toán cho nhà cung cấp AI.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. Chia Sẻ và Tiết Lộ Dữ Liệu</h2>
      <p>Chúng tôi có thể chia sẻ thông tin của bạn với:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Nhà cung cấp dịch vụ:</strong> Stripe (thanh toán), Google Cloud (lưu trữ), nhà cung cấp mô hình AI (như mô tả ở trên)</li>
        <li><strong>Tuân thủ pháp luật:</strong> Khi được yêu cầu bởi luật pháp, lệnh tòa án hoặc quy định chính phủ</li>
        <li><strong>Chuyển nhượng kinh doanh:</strong> Liên quan đến sáp nhập, mua lại hoặc bán tài sản</li>
        <li><strong>Có sự đồng ý của bạn:</strong> Khi bạn ủy quyền chia sẻ một cách rõ ràng</li>
      </ul>
      <p>Chúng tôi không bán thông tin cá nhân cho bên thứ ba vì mục đích tiếp thị.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. Bảo Mật Dữ Liệu</h2>
      <p>
        Chúng tôi triển khai các biện pháp bảo mật theo tiêu chuẩn ngành bao gồm: mật khẩu được mã hóa (PBKDF2),
        mã hóa HTTPS khi truyền, quản lý phiên an toàn và kiểm soát truy cập.
        Tuy nhiên, không có phương thức truyền nào qua Internet là an toàn 100%.
        Chúng tôi không thể đảm bảo an toàn tuyệt đối cho dữ liệu của bạn.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. Lưu Giữ Dữ Liệu</h2>
      <p>
        Chúng tôi lưu giữ dữ liệu tài khoản miễn là tài khoản còn hoạt động.
        Lịch sử trò chuyện được lưu giữ vô thời hạn để cung cấp tính liên tục của cuộc trò chuyện.
        Nếu bạn xóa tài khoản, chúng tôi sẽ xóa dữ liệu cá nhân trong vòng 30 ngày,
        trừ trường hợp luật pháp yêu cầu hoặc cần thiết cho mục đích kinh doanh hợp pháp.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. Quyền Của Bạn</h2>
      <p>Tùy thuộc vào quyền tài phán của bạn, bạn có thể có quyền:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Truy cập dữ liệu cá nhân</li>
        <li>Sửa dữ liệu không chính xác</li>
        <li>Yêu cầu xóa dữ liệu (&quot;quyền được lãng quên&quot;)</li>
        <li>Xuất dữ liệu ở định dạng di động</li>
        <li>Phản đối hoặc hạn chế một số xử lý nhất định</li>
        <li>Rút lại sự đồng ý khi việc xử lý dựa trên sự đồng ý</li>
      </ul>
      <p>Để thực hiện các quyền này, hãy liên hệ {EMAIL_LINK}.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Cookie</h2>
      <p>
        Chúng tôi sử dụng cookie thiết yếu cho xác thực (mã phiên) và tùy chọn ngôn ngữ.
        Chúng tôi không sử dụng cookie quảng cáo hoặc theo dõi.
        Các công cụ phân tích bên thứ ba có thể đặt cookie riêng theo chính sách bảo mật của họ.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. Truyền Dữ Liệu Quốc Tế</h2>
      <p>
        Máy chủ của chúng tôi được lưu trữ tại Úc (khu vực AWS Sydney).
        Dữ liệu của bạn có thể được xử lý bởi nhà cung cấp AI tại Hoa Kỳ và các khu vực tài phán khác.
        Bằng việc sử dụng Dịch vụ, bạn đồng ý chuyển dữ liệu đến các khu vực tài phán này,
        nơi có thể có tiêu chuẩn bảo vệ dữ liệu khác với quốc gia cư trú của bạn.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. Trẻ Em</h2>
      <p>
        Dịch vụ không dành cho người dùng dưới 18 tuổi.
        Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em.
        Nếu phát hiện đã thu thập dữ liệu từ trẻ em, chúng tôi sẽ xóa ngay lập tức.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. Thay Đổi Chính Sách</h2>
      <p>
        Chúng tôi có thể cập nhật Chính Sách Bảo Mật này theo thời gian.
        Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trong ứng dụng.
        Việc tiếp tục sử dụng Dịch vụ đồng nghĩa với việc chấp nhận chính sách đã cập nhật.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. Liên Hệ</h2>
      <p>
        Cho các câu hỏi liên quan đến bảo mật:<br />
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
function PrivacyTH() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">นโยบายความเป็นส่วนตัว</h1>
      <p className="text-gray-400 text-sm mb-8">อัปเดตล่าสุด: มีนาคม 2026</p>
      <Disclaimer lang="th" />

      <p>
        AWSME Pty Ltd (&quot;บริษัท&quot;, &quot;เรา&quot;) ดำเนินงาน DataP.ai (&quot;บริการ&quot;)
        นโยบายความเป็นส่วนตัวนี้อธิบายวิธีที่เราเก็บรวบรวม ใช้ เปิดเผย และปกป้องข้อมูลส่วนบุคคลของคุณ
        เมื่อคุณใช้บริการ การใช้บริการถือว่าคุณยินยอมตามแนวปฏิบัติที่อธิบายไว้ในนี้
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. ข้อมูลที่เราเก็บรวบรวม</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 ข้อมูลบัญชี</h3>
      <p>เมื่อลงทะเบียน เราเก็บรวบรวม: ที่อยู่อีเมลและรหัสผ่านที่เข้ารหัส (แฮช PBKDF2 — เราไม่เก็บรหัสผ่านในรูปแบบข้อความธรรมดา)</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 โปรไฟล์นักลงทุน</h3>
      <p>
        หากคุณทำวิซาร์ดเริ่มต้นใช้งานเสร็จสมบูรณ์ เราจะเก็บรวบรวม: ระดับการยอมรับความเสี่ยง ระยะเวลาการลงทุน
        กลยุทธ์ที่ต้องการ ตลาดหลักทรัพย์ที่ต้องการ อุตสาหกรรมที่ต้องการ ช่วงขนาดพอร์ตการลงทุน
        การตั้งค่าการวิเคราะห์ และรูปแบบการตอบสนอง ข้อมูลนี้ใช้เพื่อปรับแต่งประสบการณ์ของคุณเท่านั้น
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 ข้อมูลการใช้งาน</h3>
      <p>
        เราเก็บรวบรวมข้อมูลเกี่ยวกับวิธีที่คุณใช้บริการ รวมถึง: หน้าที่เยี่ยมชม หุ้นที่วิเคราะห์
        ข้อความแชทกับผู้ช่วย AI รายการเฝ้าดูที่เลือก และการใช้งานฟีเจอร์
        การสนทนาแชทจะถูกจัดเก็บเพื่อให้ประวัติการสนทนาและปรับปรุงโมเดล AI ของเรา
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 ข้อมูลอุปกรณ์และเทคนิค</h3>
      <p>
        เราเก็บรวบรวมโดยอัตโนมัติ: ประเภทเบราว์เซอร์ ระบบปฏิบัติการ ที่อยู่ IP URL อ้างอิง
        และระยะเวลาเซสชัน ผ่านบันทึกเว็บเซิร์ฟเวอร์มาตรฐานและเครื่องมือวิเคราะห์
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 ข้อมูลการชำระเงิน</h3>
      <p>
        การประมวลผลการชำระเงินจัดการโดย Stripe เราไม่เก็บหมายเลขบัตรเครดิต รายละเอียดบัญชีธนาคาร
        หรือข้อมูลทางการเงินที่ละเอียดอ่อนอื่น ๆ บนเซิร์ฟเวอร์ของเรา เราเก็บเฉพาะ Stripe Customer ID
        และสถานะการสมัครสมาชิก
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. วิธีที่เราใช้ข้อมูลของคุณ</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>ให้บริการและปรับแต่งบริการ (การวิเคราะห์ AI ที่ปรับตามโปรไฟล์ของคุณ)</li>
        <li>ประมวลผลการชำระเงินและจัดการการสมัครสมาชิก</li>
        <li>ส่งการสื่อสารที่เกี่ยวข้องกับบริการ (การยืนยันบัญชี การแจ้งเตือนความปลอดภัย การอัปเดตการสมัคร)</li>
        <li>ปรับปรุงโมเดล AI และคุณภาพการวิเคราะห์</li>
        <li>ติดตามและป้องกันการฉ้อโกง การใช้ในทางที่ผิด และภัยคุกคามด้านความปลอดภัย</li>
        <li>ปฏิบัติตามข้อผูกพันทางกฎหมาย</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. ข้อมูล AI และแชท</h2>
      <p>
        การสนทนาของคุณกับผู้ช่วย AI จะถูกจัดเก็บในฐานข้อมูลเพื่อให้ประวัติการสนทนา
        และดึงการตั้งค่าเพื่อปรับปรุงการตอบสนองในอนาคต (เช่น จดจำระดับการยอมรับความเสี่ยงของคุณ)
        เราอาจใช้ข้อมูลแชทที่ไม่ระบุตัวตนและรวมเพื่อปรับปรุงโมเดล AI ของเรา
        เราไม่แบ่งปันเนื้อหาแชทส่วนบุคคลกับบุคคลที่สาม ยกเว้นตามที่อธิบายไว้ในหมวดที่ 5
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. การแบ่งปันข้อมูลกับผู้ให้บริการ AI</h2>
      <p>
        เพื่อสร้างการตอบสนอง AI เราส่งคำค้นหาและบริบทที่เกี่ยวข้องไปยังผู้ให้บริการ AI บุคคลที่สาม ได้แก่:
        Google (Gemini), OpenAI (GPT) และ Anthropic (Claude)
        ผู้ให้บริการเหล่านี้ประมวลผลข้อมูลของคุณตามนโยบายความเป็นส่วนตัวและข้อตกลงการประมวลผลข้อมูลของแต่ละราย
        เราไม่ส่งที่อยู่อีเมล รหัสผ่าน หรือข้อมูลการชำระเงินให้ผู้ให้บริการ AI
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. การแบ่งปันและเปิดเผยข้อมูล</h2>
      <p>เราอาจแบ่งปันข้อมูลของคุณกับ:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>ผู้ให้บริการ:</strong> Stripe (การชำระเงิน), Google Cloud (โฮสติ้ง), ผู้ให้บริการโมเดล AI (ตามที่อธิบายข้างต้น)</li>
        <li><strong>การปฏิบัติตามกฎหมาย:</strong> เมื่อกฎหมาย คำสั่งศาล หรือกฎระเบียบของรัฐบาลกำหนด</li>
        <li><strong>การโอนธุรกิจ:</strong> เกี่ยวข้องกับการควบรวม การซื้อกิจการ หรือการขายสินทรัพย์</li>
        <li><strong>ด้วยความยินยอมของคุณ:</strong> เมื่อคุณอนุญาตการแบ่งปันอย่างชัดแจ้ง</li>
      </ul>
      <p>เราไม่ขายข้อมูลส่วนบุคคลให้บุคคลที่สามเพื่อวัตถุประสงค์ทางการตลาด</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. ความปลอดภัยของข้อมูล</h2>
      <p>
        เราดำเนินมาตรการรักษาความปลอดภัยตามมาตรฐานอุตสาหกรรม รวมถึง: รหัสผ่านเข้ารหัส (PBKDF2),
        การเข้ารหัส HTTPS ระหว่างการส่ง การจัดการเซสชันอย่างปลอดภัย และการควบคุมการเข้าถึง
        อย่างไรก็ตาม ไม่มีวิธีการส่งข้อมูลผ่านอินเทอร์เน็ตที่ปลอดภัย 100%
        เราไม่สามารถรับประกันความปลอดภัยสมบูรณ์ของข้อมูลของคุณได้
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. การเก็บรักษาข้อมูล</h2>
      <p>
        เราเก็บรักษาข้อมูลบัญชีตราบเท่าที่บัญชีของคุณยังใช้งานอยู่
        ประวัติแชทจะถูกเก็บรักษาอย่างไม่มีกำหนดเพื่อให้ความต่อเนื่องของการสนทนา
        หากคุณลบบัญชี เราจะลบข้อมูลส่วนบุคคลภายใน 30 วัน
        ยกเว้นกรณีที่กฎหมายกำหนดหรือจำเป็นเพื่อวัตถุประสงค์ทางธุรกิจที่ชอบด้วยกฎหมาย
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. สิทธิ์ของคุณ</h2>
      <p>ขึ้นอยู่กับเขตอำนาจศาลของคุณ คุณอาจมีสิทธิ์:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>เข้าถึงข้อมูลส่วนบุคคลของคุณ</li>
        <li>แก้ไขข้อมูลที่ไม่ถูกต้อง</li>
        <li>ขอลบข้อมูลของคุณ (&quot;สิทธิ์ในการถูกลืม&quot;)</li>
        <li>ส่งออกข้อมูลในรูปแบบที่พกพาได้</li>
        <li>คัดค้านหรือจำกัดการประมวลผลบางอย่าง</li>
        <li>เพิกถอนความยินยอมเมื่อการประมวลผลขึ้นอยู่กับความยินยอม</li>
      </ul>
      <p>เพื่อใช้สิทธิ์เหล่านี้ โปรดติดต่อ {EMAIL_LINK}</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. คุกกี้</h2>
      <p>
        เราใช้คุกกี้ที่จำเป็นสำหรับการยืนยันตัวตน (โทเค็นเซสชัน) และการตั้งค่าภาษา
        เราไม่ใช้คุกกี้โฆษณาหรือติดตาม
        เครื่องมือวิเคราะห์ของบุคคลที่สามอาจตั้งค่าคุกกี้ของตนเองตามนโยบายความเป็นส่วนตัวของพวกเขา
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. การถ่ายโอนข้อมูลระหว่างประเทศ</h2>
      <p>
        เซิร์ฟเวอร์ของเราโฮสต์ในออสเตรเลีย (AWS ซิดนีย์)
        ข้อมูลของคุณอาจถูกประมวลผลโดยผู้ให้บริการ AI ในสหรัฐอเมริกาและเขตอำนาจศาลอื่น ๆ
        การใช้บริการถือว่าคุณยินยอมให้ถ่ายโอนข้อมูลไปยังเขตอำนาจศาลเหล่านี้
        ซึ่งอาจมีมาตรฐานการปกป้องข้อมูลที่แตกต่างจากประเทศที่คุณอาศัยอยู่
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. เด็ก</h2>
      <p>
        บริการนี้ไม่ได้มีไว้สำหรับผู้ใช้ที่มีอายุต่ำกว่า 18 ปี
        เราไม่จงใจเก็บรวบรวมข้อมูลส่วนบุคคลจากเด็ก
        หากเราทราบว่าได้เก็บรวบรวมข้อมูลจากเด็ก เราจะลบทันที
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. การเปลี่ยนแปลงนโยบาย</h2>
      <p>
        เราอาจอัปเดตนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
        การเปลี่ยนแปลงสำคัญจะแจ้งผ่านอีเมลหรือการแจ้งเตือนในแอป
        การใช้บริการต่อเนื่องถือว่ายอมรับนโยบายที่อัปเดต
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. ติดต่อ</h2>
      <p>
        สำหรับคำถามเกี่ยวกับความเป็นส่วนตัว:<br />
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
function PrivacyMS() {
  return (
    <>
      <h1 className="text-3xl font-bold text-[#252525] mb-2">Dasar Privasi</h1>
      <p className="text-gray-400 text-sm mb-8">Kemas kini terakhir: Mac 2026</p>
      <Disclaimer lang="ms" />

      <p>
        AWSME Pty Ltd (&quot;Syarikat&quot;, &quot;kami&quot;) mengendalikan DataP.ai (&quot;Perkhidmatan&quot;).
        Dasar Privasi ini menerangkan bagaimana kami mengumpul, menggunakan, mendedahkan dan melindungi maklumat peribadi
        anda apabila anda menggunakan Perkhidmatan kami. Dengan menggunakan Perkhidmatan, anda bersetuju dengan amalan yang dinyatakan di sini.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">1. Maklumat Yang Kami Kumpul</h2>

      <h3 className="text-base font-semibold mt-4 mb-2">1.1 Maklumat akaun</h3>
      <p>Semasa mendaftar, kami mengumpul: alamat emel dan kata laluan yang disulitkan (hash PBKDF2 — kami tidak pernah menyimpan kata laluan teks biasa).</p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.2 Profil pelabur</h3>
      <p>
        Jika anda melengkapkan wizard permulaan, kami mengumpul: toleransi risiko, tempoh pelaburan, strategi pilihan,
        bursa pilihan, sektor pilihan, julat saiz portfolio, keutamaan analisis dan gaya respons.
        Data ini digunakan semata-mata untuk memperibadikan pengalaman anda.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.3 Data penggunaan</h3>
      <p>
        Kami mengumpul maklumat tentang cara anda menggunakan Perkhidmatan, termasuk: halaman yang dilawati, saham yang dianalisis,
        mesej sembang dengan pembantu AI, pilihan senarai pantau dan penggunaan ciri.
        Perbualan sembang disimpan untuk menyediakan sejarah perbualan dan meningkatkan model AI kami.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.4 Data peranti dan teknikal</h3>
      <p>
        Kami mengumpul secara automatik: jenis pelayar, sistem pengendalian, alamat IP, URL rujukan dan tempoh sesi
        melalui log pelayan web standard dan alat analitik.
      </p>

      <h3 className="text-base font-semibold mt-4 mb-2">1.5 Maklumat pembayaran</h3>
      <p>
        Pemprosesan pembayaran dikendalikan oleh Stripe. Kami tidak menyimpan nombor kad kredit, butiran akaun bank
        atau maklumat kewangan sensitif lain pada pelayan kami. Kami hanya menyimpan ID pelanggan Stripe dan status langganan anda.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">2. Cara Kami Menggunakan Maklumat Anda</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Menyediakan dan memperibadikan Perkhidmatan (analisis AI yang disesuaikan mengikut profil anda)</li>
        <li>Memproses pembayaran dan mengurus langganan</li>
        <li>Menghantar komunikasi berkaitan perkhidmatan (pengesahan akaun, amaran keselamatan, kemas kini langganan)</li>
        <li>Meningkatkan model AI dan kualiti analisis kami</li>
        <li>Memantau dan mencegah penipuan, penyalahgunaan dan ancaman keselamatan</li>
        <li>Mematuhi kewajipan undang-undang</li>
      </ul>

      <h2 className="text-xl font-bold mt-8 mb-3">3. Data AI dan Sembang</h2>
      <p>
        Perbualan anda dengan pembantu AI disimpan dalam pangkalan data kami untuk menyediakan sejarah perbualan
        dan mengekstrak keutamaan yang meningkatkan respons masa hadapan (contohnya, mengingati toleransi risiko anda).
        Kami mungkin menggunakan data sembang yang dianonimkan dan diagregatkan untuk meningkatkan model AI kami.
        Kami tidak berkongsi kandungan sembang individu anda dengan pihak ketiga kecuali seperti yang diterangkan dalam Seksyen 5.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">4. Perkongsian Data dengan Pembekal AI</h2>
      <p>
        Untuk menjana respons AI, kami menghantar pertanyaan anda dan konteks yang berkaitan kepada pembekal AI pihak ketiga termasuk:
        Google (Gemini), OpenAI (GPT) dan Anthropic (Claude).
        Pembekal ini memproses data anda mengikut dasar privasi dan perjanjian pemprosesan data masing-masing.
        Kami tidak menghantar alamat emel, kata laluan atau maklumat pembayaran anda kepada pembekal AI.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">5. Perkongsian dan Pendedahan Data</h2>
      <p>Kami mungkin berkongsi maklumat anda dengan:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Pembekal perkhidmatan:</strong> Stripe (pembayaran), Google Cloud (pengehosan), pembekal model AI (seperti diterangkan di atas)</li>
        <li><strong>Pematuhan undang-undang:</strong> Apabila dikehendaki oleh undang-undang, perintah mahkamah atau peraturan kerajaan</li>
        <li><strong>Pemindahan perniagaan:</strong> Berkaitan dengan penggabungan, pemerolehan atau penjualan aset</li>
        <li><strong>Dengan persetujuan anda:</strong> Apabila anda secara jelas membenarkan perkongsian</li>
      </ul>
      <p>Kami tidak menjual maklumat peribadi anda kepada pihak ketiga untuk tujuan pemasaran.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">6. Keselamatan Data</h2>
      <p>
        Kami melaksanakan langkah keselamatan standard industri termasuk: kata laluan yang disulitkan (PBKDF2),
        penyulitan HTTPS semasa penghantaran, pengurusan sesi yang selamat dan kawalan akses.
        Walau bagaimanapun, tiada kaedah penghantaran melalui Internet yang 100% selamat.
        Kami tidak dapat menjamin keselamatan mutlak data anda.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">7. Penyimpanan Data</h2>
      <p>
        Kami menyimpan data akaun anda selagi akaun anda aktif.
        Sejarah sembang disimpan selama-lamanya untuk menyediakan kesinambungan perbualan.
        Jika anda memadamkan akaun, kami akan mengalih keluar data peribadi anda dalam masa 30 hari,
        kecuali di mana penyimpanan diperlukan oleh undang-undang atau untuk tujuan perniagaan yang sah.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">8. Hak Anda</h2>
      <p>Bergantung pada bidang kuasa anda, anda mungkin mempunyai hak untuk:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Mengakses data peribadi anda</li>
        <li>Membetulkan data yang tidak tepat</li>
        <li>Meminta pemadaman data anda (&quot;hak untuk dilupakan&quot;)</li>
        <li>Mengeksport data anda dalam format mudah alih</li>
        <li>Membantah atau menyekat pemprosesan tertentu</li>
        <li>Menarik balik persetujuan di mana pemprosesan berdasarkan persetujuan</li>
      </ul>
      <p>Untuk menggunakan hak ini, hubungi kami di {EMAIL_LINK}.</p>

      <h2 className="text-xl font-bold mt-8 mb-3">9. Kuki</h2>
      <p>
        Kami menggunakan kuki penting untuk pengesahan (token sesi) dan keutamaan bahasa.
        Kami tidak menggunakan kuki pengiklanan atau penjejakan.
        Alat analitik pihak ketiga mungkin menetapkan kuki mereka sendiri tertakluk pada dasar privasi mereka.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">10. Pemindahan Data Antarabangsa</h2>
      <p>
        Pelayan kami dihoskan di Australia (rantau AWS Sydney).
        Data anda mungkin diproses oleh pembekal AI di Amerika Syarikat dan bidang kuasa lain.
        Dengan menggunakan Perkhidmatan, anda bersetuju dengan pemindahan data anda ke bidang kuasa ini,
        yang mungkin mempunyai standard perlindungan data yang berbeza daripada negara tempat tinggal anda.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">11. Kanak-kanak</h2>
      <p>
        Perkhidmatan ini tidak ditujukan untuk pengguna di bawah 18 tahun.
        Kami tidak dengan sengaja mengumpul maklumat peribadi daripada kanak-kanak.
        Jika kami mengetahui bahawa kami telah mengumpul data daripada kanak-kanak, kami akan memadamkannya dengan segera.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">12. Perubahan Kepada Dasar Ini</h2>
      <p>
        Kami mungkin mengemaskini Dasar Privasi ini dari semasa ke semasa.
        Perubahan penting akan dimaklumkan melalui emel atau notifikasi dalam aplikasi.
        Penggunaan berterusan Perkhidmatan bermaksud penerimaan dasar yang dikemaskini.
      </p>

      <h2 className="text-xl font-bold mt-8 mb-3">13. Hubungi Kami</h2>
      <p>
        Untuk pertanyaan berkaitan privasi:<br />
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
export const privacyContent: Record<string, ReactNode> = {
  en: <PrivacyEN />,
  zh: <PrivacyZH />,
  "zh-TW": <PrivacyZHTW />,
  ja: <PrivacyJA />,
  ko: <PrivacyKO />,
  vi: <PrivacyVI />,
  th: <PrivacyTH />,
  ms: <PrivacyMS />,
};
