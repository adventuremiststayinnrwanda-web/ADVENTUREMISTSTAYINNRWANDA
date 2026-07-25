import { Resend } from "resend";
import QRCode from "qrcode";

interface SendEmailParams {
  to: string;
  name?: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ to, name, subject, htmlContent }: SendEmailParams) {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (brevoApiKey) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "content-type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify({
          sender: {
            name: process.env.BREVO_SENDER_NAME || "Adventure Mist Stay Inn Rwanda",
            email: process.env.BREVO_SENDER_EMAIL || "adventuremiststayinnrwanda@gmail.com"
          },
          to: [{ email: to, name: name || to }],
          subject,
          htmlContent
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Brevo API Email Error:", response.status, errorText);
      } else {
        console.log(`Brevo email successfully sent to ${to}`);
        return true;
      }
    } catch (err) {
      console.error("Brevo email network error:", err);
    }
  }

  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Adventure Mist Stay Inn Rwanda <onboarding@resend.dev>",
        to,
        subject,
        html: htmlContent
      });
      console.log(`Resend email successfully sent to ${to}`);
      return true;
    } catch (err) {
      console.error("Resend email error:", err);
    }
  }

  console.log(`[Email Log - No API Key Set] To: ${to} | Subject: ${subject}`);
  return false;
}

export async function sendBookingConfirmation(booking: any, roomName?: string, hotelName?: string) {
  const finalRoomName = roomName || booking.room_name || "Reserved Room";
  const finalHotelName = hotelName || booking.hotel_name || "Adventure Mist Stay Inn Rwanda";
  const checkInDate = booking.check_in_date || booking.check_in ? new Date(booking.check_in_date || booking.check_in).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : "TBD";
  const checkOutDate = booking.check_out_date || booking.check_out ? new Date(booking.check_out_date || booking.check_out).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : "TBD";

  // Create verification payload for QR code
  const verificationPayload = {
    customer_id: booking.booking_reference,
    booking_id: booking.id,
    guest_name: booking.guest_full_name,
    hotel: finalHotelName,
    room: finalRoomName,
    dates: `${checkInDate} to ${checkOutDate}`,
    amount_paid: `$${booking.total_amount}`,
    status: "CONFIRMED_PAID",
    verified_authenticity: true
  };

  const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(verificationPayload), {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 280,
    color: {
      dark: "#064e3b",
      light: "#ffffff"
    }
  });

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #047857 0%, #064e3b 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase; }
        .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background-color: #dcfce7; color: #15803d; border: 1px solid #86efac; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
        .details-box { background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .details-row:last-child { border-bottom: none; }
        .label { color: #64748b; font-weight: 500; }
        .value { color: #0f172a; font-weight: 700; text-align: right; }
        .qr-section { text-align: center; background-color: #ecfdf5; border: 2px dashed #059669; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .qr-section img { max-width: 220px; height: auto; border-radius: 8px; border: 4px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>${finalHotelName}</h1>
          <p>Official Booking Confirmation & Receipt</p>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <div class="badge">✓ Payment Confirmed & Verified</div>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">Dear <strong>${booking.guest_full_name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Thank you for choosing us! Your payment has been successfully processed and your reservation for <strong>${finalRoomName}</strong> is confirmed.
          </p>

          <div class="details-box">
            <div class="details-row">
              <span class="label">Customer / Booking ID:</span>
              <span class="value" style="font-family: monospace; font-size: 15px; color: #047857;">${booking.booking_reference}</span>
            </div>
            <div class="details-row">
              <span class="label">Hotel:</span>
              <span class="value">${finalHotelName}</span>
            </div>
            <div class="details-row">
              <span class="label">Room Type:</span>
              <span class="value">${finalRoomName}</span>
            </div>
            <div class="details-row">
              <span class="label">Check-in Date:</span>
              <span class="value">${checkInDate} (From 14:00)</span>
            </div>
            <div class="details-row">
              <span class="label">Check-out Date:</span>
              <span class="value">${checkOutDate} (Until 11:00)</span>
            </div>
            <div class="details-row">
              <span class="label">Guests:</span>
              <span class="value">${booking.guest_count || 1} Person(s)</span>
            </div>
            <div class="details-row">
              <span class="label">Total Paid:</span>
              <span class="value" style="color: #047857; font-size: 16px;">$${booking.total_amount} USD</span>
            </div>
          </div>

          <div class="qr-section">
            <h3 style="margin: 0 0 8px 0; color: #064e3b; font-size: 16px;">Your Official Check-In QR Pass</h3>
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #047857;">Show this QR code at front desk upon arrival for instant check-in verification.</p>
            <img src="${qrCodeBase64}" alt="Check-In QR Pass" />
            <p style="margin: 12px 0 0 0; font-size: 11px; font-family: monospace; color: #475569;">VERIFIED CUSTOMER ID: ${booking.booking_reference}</p>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            If you need to adjust your reservation or have special requests, please contact our support team at <a href="mailto:adventuremiststayinnrwanda@gmail.com" style="color: #047857; text-decoration: underline;">adventuremiststayinnrwanda@gmail.com</a> or call <strong>+250 782 656 071</strong>.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} Adventure Mist Stay Inn Rwanda. All rights reserved.</p>
          <p style="margin: 4px 0 0 0; font-size: 11px;">Powered by P & D Digital Solution</p>
        </div>
      </div>
    </body>
    </html>
  `.trim();

  return await sendEmail({
    to: booking.guest_email,
    name: booking.guest_full_name,
    subject: `Booking Confirmation & QR Pass: ${finalRoomName} (${booking.booking_reference})`,
    htmlContent: htmlBody
  });
}

export async function sendPaymentReminderEmail(booking: any, roomName?: string, hotelName?: string) {
  const finalRoomName = roomName || booking.room_name || "Reserved Room";
  const finalHotelName = hotelName || booking.hotel_name || "Adventure Mist Stay Inn Rwanda";
  const checkInDate = booking.check_in_date || booking.check_in ? new Date(booking.check_in_date || booking.check_in).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : "TBD";
  const checkOutDate = booking.check_out_date || booking.check_out ? new Date(booking.check_out_date || booking.check_out).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : "TBD";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.DPO_PUBLIC_BASE_URL || "https://adventuremiststayinnrwanda.vercel.app";
  const directPaymentUrl = `${baseUrl}/booking-lookup?ref=${booking.booking_reference}`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #d97706 0%, #b45309 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase; }
        .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; margin-bottom: 16px; }
        .details-box { background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fef3c7; font-size: 14px; }
        .details-row:last-child { border-bottom: none; }
        .label { color: #78350f; font-weight: 500; }
        .value { color: #451a03; font-weight: 700; text-align: right; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #047857 0%, #065f46 100%); color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: 800; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 14px rgba(4,120,87,0.4); }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>${finalHotelName}</h1>
          <p>Payment Reminder for Pending Reservation</p>
        </div>
        <div class="content">
          <div style="text-align: center;">
            <div class="badge">⏱ Action Required: Pending Payment</div>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">Dear <strong>${booking.guest_full_name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            We noticed that your reservation for <strong>${finalRoomName}</strong> at <strong>${finalHotelName}</strong> has been received, but payment is still pending.
          </p>

          <div class="details-box">
            <div class="details-row">
              <span class="label">Reservation Reference:</span>
              <span class="value" style="font-family: monospace;">${booking.booking_reference}</span>
            </div>
            <div class="details-row">
              <span class="label">Room Reserved:</span>
              <span class="value">${finalRoomName}</span>
            </div>
            <div class="details-row">
              <span class="label">Check-in / Check-out:</span>
              <span class="value">${checkInDate} → ${checkOutDate}</span>
            </div>
            <div class="details-row">
              <span class="label">Total Amount Due:</span>
              <span class="value" style="color: #b45309; font-size: 16px;">$${booking.total_amount} USD</span>
            </div>
          </div>

          <div class="btn-container">
            <a href="${directPaymentUrl}" class="btn">Click Here to Pay &amp; Confirm Booking</a>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5; text-align: center;">
            Or copy and paste this direct payment link into your browser:<br/>
            <a href="${directPaymentUrl}" style="color: #047857; word-break: break-all;">${directPaymentUrl}</a>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} Adventure Mist Stay Inn Rwanda. All rights reserved.</p>
          <p style="margin: 4px 0 0 0; font-size: 11px;">Powered by P & D Digital Solution</p>
        </div>
      </div>
    </body>
    </html>
  `.trim();

  return await sendEmail({
    to: booking.guest_email,
    name: booking.guest_full_name,
    subject: `Payment Reminder: Complete Your Reservation (${booking.booking_reference})`,
    htmlContent: htmlBody
  });
}
