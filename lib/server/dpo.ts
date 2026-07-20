export type DpoSubmitOrder = {
  reference: string;
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
  customer: {
    email: string;
    phone: string;
    name: string;
  };
};

export type DpoOrderResponse = {
  transToken?: string;
  transRef?: string;
  redirectUrl?: string;
  error?: string;
};

export type DpoStatusResponse = {
  result: string;
  resultExplanation: string;
  transactionApproval?: string;
  customerCredit?: string;
  customerCreditType?: string;
  transactionCurrency?: string;
  transactionAmount?: string;
};

/**
 * Utility to extract content from flat XML tags.
 */
export function extractXmlTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match ? match[1].trim() : "";
}

function getFormattedDate() {
  // Use the real wall clock (Date() constructor always uses real system time,
  // even if Date.now has been patched for Supabase JWT clock-skew workaround)
  const d = new Date(Date.prototype.valueOf.call(new Date()));
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const min = String(d.getUTCMinutes()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
}

export async function submitDpoOrder(order: DpoSubmitOrder): Promise<DpoOrderResponse> {
  const companyToken = process.env.DPO_COMPANY_TOKEN;
  const serviceType = process.env.DPO_SERVICE_TYPE;
  const endpoint = process.env.DPO_ENDPOINT || "https://secure.3gdirectpay.com/API/v6/";
  const basePaymentUrl = process.env.DPO_PAYMENT_URL || "https://secure.3gdirectpay.com/payv3.php?ID=";

  if (!companyToken || !serviceType) {
    throw new Error("DPO company token or service type is missing from environment variables.");
  }

  const [firstName = "", ...lastNameParts] = order.customer.name.trim().split(/\s+/);
  const lastName = lastNameParts.join(" ") || "Guest";

  // XML Payload for createToken (Option A)
  const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${companyToken}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${order.amount.toFixed(2)}</PaymentAmount>
    <PaymentCurrency>${order.currency}</PaymentCurrency>
    <CompanyRef>${order.reference}</CompanyRef>
    <RedirectURL>${order.callbackUrl}</RedirectURL>
    <BackURL>${order.callbackUrl}</BackURL>
    <CompanyRefUnique>0</CompanyRefUnique>
    <PTL>5</PTL>
    <customerFirstName>${firstName}</customerFirstName>
    <customerLastName>${lastName}</customerLastName>
    <customerEmail>${order.customer.email}</customerEmail>
    <customerPhone>${order.customer.phone}</customerPhone>
  </Transaction>
  <Services>
    <Service>
      <ServiceType>${serviceType}</ServiceType>
      <ServiceDescription>${order.description.slice(0, 100)}</ServiceDescription>
      <ServiceDate>${getFormattedDate()}</ServiceDate>
    </Service>
  </Services>
</API3G>`.trim();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        Accept: "application/xml"
      },
      body: xmlPayload,
      cache: "no-store"
    });

    const responseText = await response.text();

    if (!response.ok) {
      return { error: `DPO server responded with HTTP status ${response.status}: ${responseText}` };
    }

    const result = extractXmlTag(responseText, "Result");
    const resultExplanation = extractXmlTag(responseText, "ResultExplanation");

    if (result !== "000") {
      return { error: `DPO Error ${result}: ${resultExplanation}` };
    }

    const transToken = extractXmlTag(responseText, "TransToken");
    const transRef = extractXmlTag(responseText, "TransRef");

    if (!transToken) {
      return { error: "DPO transaction token was not found in response." };
    }

    return {
      transToken,
      transRef,
      redirectUrl: `${basePaymentUrl}${transToken}`
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error during DPO order submission." };
  }
}

export async function getDpoTransactionStatus(transactionToken: string): Promise<DpoStatusResponse> {
  const companyToken = process.env.DPO_COMPANY_TOKEN;
  const endpoint = process.env.DPO_ENDPOINT || "https://secure.3gdirectpay.com/API/v6/";

  if (!companyToken) {
    throw new Error("DPO company token is missing from environment variables.");
  }

  // XML Payload for verifyToken
  const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${companyToken}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${transactionToken}</TransactionToken>
</API3G>`.trim();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      Accept: "application/xml"
    },
    body: xmlPayload,
    cache: "no-store"
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`DPO verifyToken HTTP error ${response.status}`);
  }

  const result = extractXmlTag(responseText, "Result");
  const resultExplanation = extractXmlTag(responseText, "ResultExplanation");
  const transactionApproval = extractXmlTag(responseText, "TransactionApproval") || undefined;
  const customerCredit = extractXmlTag(responseText, "CustomerCredit") || undefined;
  const customerCreditType = extractXmlTag(responseText, "CustomerCreditType") || undefined;
  const transactionCurrency = extractXmlTag(responseText, "TransactionCurrency") || undefined;
  const transactionAmount = extractXmlTag(responseText, "TransactionAmount") || undefined;

  return {
    result,
    resultExplanation,
    transactionApproval,
    customerCredit,
    customerCreditType,
    transactionCurrency,
    transactionAmount
  };
}
