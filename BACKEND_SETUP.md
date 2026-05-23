# Backend Setup

## Supabase

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Add hotels, hotel images, rooms, and room images.
5. Keep Row Level Security enabled.

The frontend currently uses browser storage for preview mode. The production version should replace the local arrays with Supabase reads and writes.

## Local Backend

This project includes a dependency-free Node backend:

```bash
node backend/server.js
```

Available Next.js routes:

- `POST /api/bookings`
- `GET /api/pesapal/callback`
- `GET|POST /api/webhooks/pesapal`

## Pesapal

Frontend payment flow:

1. Customer selects room and dates.
2. Website calculates nights, taxes, and total amount.
3. Customer clicks `Pay with Pesapal`.
4. The app creates a pending booking in Supabase.
5. The backend calls Pesapal API 3.0 `SubmitOrderRequest`.
6. Customer is redirected to the Pesapal payment URL.
7. Pesapal redirects back to `/api/pesapal/callback`.
8. Pesapal also calls `/api/webhooks/pesapal` for IPN updates.

Backend webhook flow:

1. Receive `OrderTrackingId` and `OrderMerchantReference`.
2. Fetch transaction status from Pesapal.
3. Match the booking reference.
4. Mark completed payments as successful.
5. Save payment.
6. Mark booking confirmed.
7. Mark room fully booked.
8. Generate QR token.
9. Send email with Resend or SendGrid.

## Environment Variables

Use these for Supabase:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Use this in the frontend:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use these for Pesapal API 3.0:

```bash
PESAPAL_MODE=sandbox
PESAPAL_CONSUMER_KEY=
PESAPAL_CONSUMER_SECRET=
PESAPAL_IPN_ID=
PESAPAL_CURRENCY=USD
PESAPAL_PUBLIC_BASE_URL=https://your-domain.com
ADMIN_EMAIL=adventuremiststayinnrwanda@gmail.com
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

Register the public IPN URL in Pesapal first. The URL must be public HTTPS:

```text
https://your-domain.com/api/webhooks/pesapal
```

Pesapal will return an IPN ID. Put that value in `PESAPAL_IPN_ID`.

You can register or list IPNs from the app after `PESAPAL_PUBLIC_BASE_URL` is set:

```bash
curl -X POST https://your-domain.com/api/pesapal/register-ipn
curl https://your-domain.com/api/pesapal/register-ipn
```

The app uses Pesapal API 3.0 like this:

- `RegisterIPN` creates the `PESAPAL_IPN_ID`.
- `SubmitOrderRequest` sends the customer to Pesapal.
- `/api/pesapal/callback` redirects the customer back to booking lookup.
- `/api/webhooks/pesapal` receives IPN updates and confirms the booking after `GetTransactionStatus` returns completed.

## Email

Recommended providers:

- Resend
- SendGrid

The email should include:

- Booking ID
- Hotel name
- Room name
- Dates
- Amount paid
- QR code or QR verification link
