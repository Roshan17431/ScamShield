export interface AwarenessArticle {
  id: string;
  category: string;
  title: string;
  description: string;
  howItWorks: string;
  warningSigns: string[];
  tips: string[];
}

export const awarenessArticles: AwarenessArticle[] = [
  {
    id: "banking-phishing",
    category: "Banking",
    title: "Banking phishing",
    description: "Fraudsters imitate a bank to make you reveal login details, card information, or a verification code.",
    howItWorks: "A message claims your account is blocked, your KYC has expired, or a payment failed. It pushes you to a look-alike website or an unofficial support number.",
    warningSigns: ["Unexpected urgency or threats of account closure", "A shortened or misspelled bank website", "Requests for OTP, PIN, CVV, or remote-device access"],
    tips: ["Open your banking app or type the official website yourself", "Call the number printed on your card, not the message", "Never share a one-time password with anyone"]
  },
  {
    id: "upi-payment",
    category: "UPI",
    title: "UPI payment requests",
    description: "UPI scams use collect requests, fake refunds, or payment screenshots to trick you into approving a debit.",
    howItWorks: "The scammer says you must approve a request to receive money, a refund, or a prize. Approving a collect request actually sends money from your account.",
    warningSigns: ["Someone says you need a PIN to receive money", "A collect request from an unfamiliar name", "Pressure to approve a request while on a call"],
    tips: ["Read whether the app says Pay or Collect before approving", "Use your UPI PIN only when you intend to send money", "Verify a refund inside the official merchant app or website"]
  },
  {
    id: "qr-code",
    category: "QR Code",
    title: "QR code payment scams",
    description: "A malicious QR code can open a payment request or a fake sign-in page instead of sending you money.",
    howItWorks: "The scammer shares a QR code for a sale, refund, or payment collection. After scanning, they ask you to enter your UPI PIN or banking credentials.",
    warningSigns: ["A stranger asks you to scan a code to receive money", "A QR code arrives during an unexpected refund discussion", "The scanned page asks for account credentials"],
    tips: ["Do not scan codes from unknown people", "Confirm the merchant and amount in your payment app", "Remember: scanning a QR code does not receive money automatically"]
  },
  {
    id: "job-scams",
    category: "Job",
    title: "Job and task scams",
    description: "Fake recruiters promise easy work or high pay, then demand registration fees, deposits, or personal documents.",
    howItWorks: "A message offers guaranteed work-from-home income with little information about the employer. It may move you to WhatsApp or Telegram and ask for money before work begins.",
    warningSigns: ["Upfront fees for training, registration, or equipment", "Unrealistic salary for minimal work", "No verifiable company website, role, or interview process"],
    tips: ["Research the employer through its official website and LinkedIn page", "Never pay to secure a job", "Share only the minimum personal information needed after verifying the employer"]
  },
  {
    id: "investment-scams",
    category: "Investment",
    title: "Investment and trading scams",
    description: "Fraudulent advisers promote guaranteed returns, exclusive tips, or fake trading dashboards to take deposits.",
    howItWorks: "A social-media post or group shows impressive profits and invites you to invest quickly. Early withdrawals may be allowed to build trust before larger deposits are blocked.",
    warningSigns: ["Guaranteed or unusually high returns", "Pressure to invest today or keep the opportunity secret", "Requests to transfer funds to a personal account or crypto wallet"],
    tips: ["Use only regulated platforms you verify independently", "Treat profit screenshots and testimonials as unverified", "Discuss major investments with a trusted adviser before transferring funds"]
  },
  {
    id: "courier-scams",
    category: "Courier",
    title: "Courier and delivery scams",
    description: "Scammers impersonate courier services to collect a small fee, steal card details, or install harmful apps.",
    howItWorks: "A text says a parcel is delayed, an address is incomplete, or a customs fee is due. The included link leads to a fake tracking or payment page.",
    warningSigns: ["A delivery message for something you did not order", "A short link instead of the courier’s official domain", "Requests for a small payment to release a parcel"],
    tips: ["Check tracking only in the merchant or courier’s official app", "Do not install apps from delivery links", "Contact the seller using the order confirmation you already have"]
  },
  {
    id: "lottery-scams",
    category: "Lottery",
    title: "Lottery and prize scams",
    description: "Prize scams tell you that you won a lottery, contest, or giveaway you never entered and then request a fee.",
    howItWorks: "The fraudster creates excitement, then claims taxes, processing charges, or verification payments are needed before the prize can be released.",
    warningSigns: ["A prize from a contest you never entered", "Fees required before receiving a reward", "A request to keep the prize claim secret or act immediately"],
    tips: ["Do not pay to claim an unexpected prize", "Do not send identity documents to a prize messenger", "Verify promotions through the organizer’s official website"]
  },
  {
    id: "social-media",
    category: "Social Media",
    title: "Social-media impersonation",
    description: "A criminal copies a friend, creator, company, or support account to ask for money, codes, or account access.",
    howItWorks: "The account looks familiar but uses a changed username, a new profile, or an urgent direct message. It may ask for a loan or send a suspicious link.",
    warningSigns: ["A familiar person suddenly asks for money or codes", "A new account with copied photos and few real interactions", "A support account contacts you first by direct message"],
    tips: ["Verify requests through a known phone number or another channel", "Report and block impersonation accounts", "Enable two-factor authentication on social accounts"]
  },
  {
    id: "otp-kyc",
    category: "OTP",
    title: "OTP and KYC fraud",
    description: "Criminals pose as bank, wallet, or telecom staff to obtain a one-time password or convince you to install remote-access software.",
    howItWorks: "They claim a KYC update is urgent and guide you through steps while staying on the phone. Their goal is to take control of an account or approve a transfer.",
    warningSigns: ["An unsolicited call asking for an OTP or PIN", "Instructions to install screen-sharing or remote-control software", "A threat that your SIM, wallet, or account will stop working"],
    tips: ["End the call and contact the company through an official number", "Never read an OTP aloud or share it in chat", "Review installed apps and account activity if you already shared access"]
  },
  {
    id: "online-shopping",
    category: "Online Shopping",
    title: "Online-shopping fraud",
    description: "Fake stores, marketplace sellers, and refund agents use unrealistic discounts or off-platform payments to steal money.",
    howItWorks: "A social ad or seller offers a popular item far below normal price. After payment, the seller disappears, delivers a different item, or sends a fake refund link.",
    warningSigns: ["Prices far below every established retailer", "Only payment by transfer, QR code, or personal wallet", "A seller refuses to use the marketplace’s protected checkout"],
    tips: ["Check independent reviews and the seller’s return policy", "Pay through the platform’s protected checkout when possible", "Keep order records and report fraudulent listings promptly"]
  }
];
