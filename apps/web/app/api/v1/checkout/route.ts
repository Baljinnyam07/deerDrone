import { NextResponse } from "next/server";
import { products } from "@deer-drone/data";
import type { CheckoutPayload, CheckoutResponse } from "@deer-drone/types";
import { buildOrderFromCheckout, validateCheckoutPayload } from "@deer-drone/utils";

function buildQrSvg(label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320">
    <rect width="320" height="320" rx="24" fill="#07111f" />
    <rect x="26" y="26" width="268" height="268" rx="20" fill="#ffffff" />
    <text x="160" y="150" text-anchor="middle" font-size="26" font-family="Arial" fill="#07111f">QPay</text>
    <text x="160" y="185" text-anchor="middle" font-size="14" font-family="Arial" fill="#07111f">${label}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutPayload;

  if (!validateCheckoutPayload(payload)) {
    return NextResponse.json({ error: "Checkout payload буруу байна." }, { status: 400 });
  }

  const order = buildOrderFromCheckout(payload, products, 4);
  const response: CheckoutResponse = {
    order,
    payment:
      payload.paymentMethod === "qpay"
        ? {
            method: "qpay",
            invoiceUrl: `https://sandbox.qpay.mn/invoice/${order.orderNumber}`,
            qrCode: buildQrSvg(order.orderNumber),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          }
        : {
            method: "bank_transfer",
            accountName: "MongolDrone LLC",
            accountNumber: "5001234567",
            reference: order.orderNumber,
          },
  };

  return NextResponse.json(response, { status: 201 });
}
