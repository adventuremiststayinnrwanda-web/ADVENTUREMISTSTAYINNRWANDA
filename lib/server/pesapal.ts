const pesapalMode = process.env.PESAPAL_MODE || "sandbox";
const baseUrl =
  pesapalMode === "live"
    ? "https://pay.pesapal.com/v3/api"
    : "https://cybqa.pesapal.com/pesapalv3/api";

type PesapalSubmitOrder = {
  reference: string;
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
  cancellationUrl?: string;
  customer: {
    email: string;
    phone: string;
    name: string;
  };
};

type PesapalOrderResponse = {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: unknown;
  status?: string;
};

type PesapalStatusResponse = {
  payment_method?: string;
  amount?: number;
  confirmation_code?: string;
  payment_status_description?: string;
  status_code?: number;
  merchant_reference?: string;
  currency?: string;
  error?: unknown;
  status?: string;
};

type PesapalIpnResponse = {
  url: string;
  created_date?: string;
  ipn_id: string;
  notification_type?: number;
  ipn_notification_type_description?: string;
  ipn_status?: number;
  ipn_status_description?: string;
  error?: unknown;
  status?: string;
};

async function pesapalFetch<T>(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
      ...(init?.headers || {})
    },
    cache: "no-store"
  });
  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  return data;
}

export async function getPesapalToken() {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error("Pesapal consumer key and secret are missing.");
  }

  const response = await fetch(`${baseUrl}/Auth/RequestToken`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret
    }),
    cache: "no-store"
  });
  const data = (await response.json()) as { token?: string; error?: unknown };

  if (!response.ok || !data.token) {
    throw new Error(JSON.stringify(data));
  }

  return data.token;
}

export async function submitPesapalOrder(order: PesapalSubmitOrder) {
  const notificationId = process.env.PESAPAL_IPN_ID;

  if (!notificationId) {
    throw new Error("Pesapal IPN ID is missing. Register your IPN URL in Pesapal first.");
  }

  const token = await getPesapalToken();
  const [firstName, ...lastNameParts] = order.customer.name.trim().split(/\s+/);

  return pesapalFetch<PesapalOrderResponse>("/Transactions/SubmitOrderRequest", token, {
    method: "POST",
    body: JSON.stringify({
      id: order.reference,
      currency: order.currency,
      amount: order.amount,
      description: order.description.slice(0, 100),
      callback_url: order.callbackUrl,
      cancellation_url: order.cancellationUrl,
      notification_id: notificationId,
      billing_address: {
        email_address: order.customer.email,
        phone_number: order.customer.phone,
        first_name: firstName || order.customer.name,
        last_name: lastNameParts.join(" ")
      }
    })
  });
}

export async function registerPesapalIpnUrl(url: string, notificationType: "GET" | "POST" = "GET") {
  const token = await getPesapalToken();

  return pesapalFetch<PesapalIpnResponse>("/URLSetup/RegisterIPN", token, {
    method: "POST",
    body: JSON.stringify({
      url,
      ipn_notification_type: notificationType
    })
  });
}

export async function getRegisteredPesapalIpns() {
  const token = await getPesapalToken();
  return pesapalFetch<PesapalIpnResponse[]>("/URLSetup/GetIpnList", token);
}

export async function getPesapalTransactionStatus(orderTrackingId: string) {
  const token = await getPesapalToken();
  return pesapalFetch<PesapalStatusResponse>(
    `/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`,
    token
  );
}
