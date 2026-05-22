import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Initialize the Firebase Admin SDK
admin.initializeApp();

/**
 * Configure SMTP Transporter using safe fallback options or customized environment parameters.
 */
const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465");
  const secure = port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("SMTP credentials (SMTP_USER/SMTP_PASS) are not configured. Falling back to log-only execution.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Cloud Function Trigger: fires when any document in 'inquiries' collection is created.
 */
export const onInquiryCreated = onDocumentCreated("inquiries/{inquiryId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No snapshot data present in firestore event.");
    return;
  }

  const data = snapshot.data();
  const inquiryId = event.params.inquiryId;
  console.log(`[TRIGGERED] Processing auto-notification for Inquiry ID: ${inquiryId}`);

  const ownerEmail = process.env.SITE_OWNER_EMAIL || "siddharthbose23@gmail.com";
  const transporter = getTransporter();

  // Extract variables with safe, elegant fallbacks
  const name = data.name || "Anonymous Prospect";
  const email = data.email || "No email provided";
  const phone = data.phone || "Not specified";
  const interest = data.interest || "General Consultation";
  const message = data.message || "(No message body)";
  const timestamp = data.timestamp || new Date().toISOString();
  const propertyTitle = data.propertyTitle ? String(data.propertyTitle) : null;
  const propertyId = data.propertyId ? String(data.propertyId) : null;

  // Build high-integrity rich HTML template matching corporate "sidco9 Ventures" branding
  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Inquiry Leads - sidco9 Ventures</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f7f7;
            margin: 0;
            padding: 24px;
            color: #1A1A1A;
          }
          .container {
            max-width: 600px;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin: 0 auto;
            border: 1px solid #EAEAEA;
          }
          .header {
            background-color: #0A0A0A;
            padding: 32px;
            text-align: center;
          }
          .header h1 {
            color: #CBA135; /* corporate gold */
            margin: 0;
            font-size: 20px;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 700;
          }
          .header p {
            color: #999999;
            margin: 8px 0 0 0;
            font-size: 11px;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .content {
            padding: 32px;
          }
          .lead-pill {
            display: inline-block;
            background-color: rgba(203, 161, 53, 0.1);
            color: #CBA135;
            padding: 6px 14px;
            border-radius: 99px;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 24px;
          }
          .detail-row {
            margin-bottom: 16px;
            border-bottom: 1px solid #F5F5F5;
            padding-bottom: 12px;
          }
          .detail-row:last-of-type {
            border-bottom: none;
            padding-bottom: 0;
          }
          .label {
            font-size: 11px;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 4px;
            font-weight: 500;
          }
          .value {
            font-size: 14px;
            color: #111111;
            font-weight: 600;
          }
          .message-box {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 12px;
            border-left: 3px solid #CBA135;
            font-size: 14px;
            line-height: 1.6;
            color: #333333;
            white-space: pre-wrap;
          }
          .footer {
            background-color: #FAF9F6;
            padding: 24px;
            text-align: center;
            font-size: 11px;
            color: #888888;
            border-top: 1px solid #EAEAEA;
          }
          .footer a {
            color: #CBA135;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>sidco9 Ventures</h1>
            <p>Intelligence, Protection &amp; Elite Real Estate Advisory</p>
          </div>
          <div class="content">
            <span class="lead-pill">New Client Consultation Lead</span>
            
            <div class="detail-row">
              <div class="label">Prospective Client Name</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="detail-row">
              <div class="label">Primary Email Address</div>
              <div class="value"><a href="mailto:${email}" style="color: #1A1A1A; text-decoration: none; border-bottom: 1px solid #999;">${email}</a></div>
            </div>
            
            <div class="detail-row">
              <div class="label">Contact Phone Number</div>
              <div class="value">${phone}</div>
            </div>
            
            <div class="detail-row">
              <div class="label">Financial or Property Interest</div>
              <div class="value">${interest}</div>
            </div>

            ${propertyId ? `
            <div class="detail-row">
              <div class="label">Referenced Asset &amp; ID</div>
              <div class="value">${propertyTitle || "Lux listing"} (${propertyId})</div>
            </div>
            ` : ""}

            <div class="detail-row" style="border-bottom: none; margin-bottom: 8px;">
              <div class="label">Client Message &amp; Brief</div>
            </div>
            <div class="message-box">${message.replace(/\r?\n/g, "<br />")}</div>
            
            <div class="detail-row" style="margin-top: 24px; border-bottom: none; padding-bottom: 0;">
              <div class="label">Timestamp of Record</div>
              <div class="value" style="font-weight: 400; font-size: 12px; color: #666;">${timestamp}</div>
            </div>
          </div>
          <div class="footer">
            <p>This auto-generated alert was securely pushed via Google Cloud &amp; Firestore Triggers on lead capture.</p>
            <p>&copy; ${new Date().getFullYear()} sidco9 Ventures. All Rights Reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  if (!transporter) {
    console.log("No SMTP server configured. Detailed notification body generated successfully:");
    console.log(htmlBody);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"sidco9 Ventures Lead Engine" <${process.env.SMTP_USER}>`,
      to: ownerEmail,
      subject: `🚨 [New Lead] ${name} - Interested in: ${interest}`,
      html: htmlBody,
    });
    console.log(`[SUCCESS] Notification email dispatched successfully to site owner (${ownerEmail}). Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`[ERROR] Failed to dispatch email notification to ${ownerEmail}:`, error);
  }
});
