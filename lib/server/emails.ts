import { Resend } from 'resend';
import QRCode from 'qrcode';

export async function sendBookingConfirmation(booking: any, roomName: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("No RESEND_API_KEY, skipping email");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify({ 
    ref: booking.booking_reference, 
    name: booking.guest_full_name, 
    amount: booking.total_amount 
  }));

  const checkInDate = booking.check_in ? new Date(booking.check_in).toLocaleDateString() : 'TBD';
  const checkOutDate = booking.check_out ? new Date(booking.check_out).toLocaleDateString() : 'TBD';

  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h1 style="color: #0b5c5d;">Your booking at Adventure Mist Stay Inn Rwanda is confirmed!</h1>
      <p>Dear ${booking.guest_full_name || 'Guest'},</p>
      <p>Thank you for booking with us. Your reservation for <strong>${roomName}</strong> is confirmed.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="margin-top: 0; font-size: 1.2rem;">Booking Details</h2>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Reference:</strong> ${booking.booking_reference}</li>
          <li><strong>Dates:</strong> ${checkInDate} to ${checkOutDate}</li>
          <li><strong>Total Amount:</strong> RWF ${booking.total_amount}</li>
        </ul>
      </div>
      <p>Please present the QR code below upon arrival:</p>
      <div style="text-align: center; margin: 20px 0;">
        <img src="${qrCodeBase64}" alt="Booking QR Code" style="max-width: 250px;" />
      </div>
      <p>We look forward to hosting you!</p>
      <p>Best regards,<br/>Adventure Mist Stay Inn Rwanda Team</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: booking.guest_email,
      subject: 'Booking Confirmation - Adventure Mist Stay Inn Rwanda',
      html: htmlBody,
    });
    console.log(`Booking confirmation email sent to ${booking.guest_email}`);
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
  }
}
