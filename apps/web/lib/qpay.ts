const BASE = process.env.QPAY_BASE_URL ?? "https://merchant.qpay.mn/v2";

// Module-level token cache — one token per process lifetime until expiry
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function parseJwtExp(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const res = await fetch(`${BASE}/auth/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.QPAY_USERNAME}:${process.env.QPAY_PASSWORD}`
      ).toString("base64")}`,
    },
  });

  if (!res.ok) {
    throw new Error(`QPay token алдаа: ${res.status}`);
  }

  const data = await res.json() as { access_token: string };
  cachedToken = data.access_token;
  tokenExpiresAt = parseJwtExp(cachedToken);
  return cachedToken;
}

export interface QPayInvoice {
  invoice_id: string;
  qr_text: string;
  qr_image: string; // base64 PNG
  urls: { name: string; description: string; logo: string; link: string }[];
}

export async function createQPayInvoice(params: {
  orderId: string;
  amount: number;
  description: string;
  callbackUrl: string;
}): Promise<QPayInvoice> {
  const token = await getToken();

  const res = await fetch(`${BASE}/invoice`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      invoice_code: process.env.QPAY_INVOICE_CODE,
      sender_invoice_no: params.orderId,
      invoice_receiver_code: "terminal",
      invoice_description: params.description,
      amount: params.amount,
      callback_url: params.callbackUrl,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`QPay invoice үүсгэх алдаа: ${res.status} — ${err}`);
  }

  return res.json() as Promise<QPayInvoice>;
}

export interface QPayCheckResult {
  count: number;
  paid_amount: number;
  rows: { payment_status: string; payment_id: string; paid_amount: number }[];
}

export async function checkQPayPayment(invoiceId: string): Promise<QPayCheckResult> {
  const token = await getToken();

  const res = await fetch(`${BASE}/payment/check`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      object_type: "INVOICE",
      object_id: invoiceId,
      offset: { page_number: 1, page_limit: 100 },
    }),
  });

  if (!res.ok) {
    throw new Error(`QPay check алдаа: ${res.status}`);
  }

  return res.json() as Promise<QPayCheckResult>;
}
