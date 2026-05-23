# ADVENTUREMISTSTAYINNRWANDA

Adventure Mist Stay Inn Rwanda hotel booking website.

## Run The Website

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

## Deployment

Deploy this project as a Next.js app on Vercel.

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PESAPAL_MODE=sandbox
PESAPAL_CONSUMER_KEY=
PESAPAL_CONSUMER_SECRET=
PESAPAL_IPN_ID=
PESAPAL_CURRENCY=USD
PESAPAL_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
ADMIN_EMAIL=adventuremiststayinnrwanda@gmail.com
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

After deployment, register the Pesapal IPN:

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/pesapal/register-ipn
```

Copy the returned `ipn_id` into `PESAPAL_IPN_ID`, then redeploy.
