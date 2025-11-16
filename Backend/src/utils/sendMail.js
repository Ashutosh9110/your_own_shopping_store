import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_SECRET
);

export const sendMail = async (to, subject, resetLink) => {
  const fullLink = resetLink; 
  
  const email = {
    to: [{ email: to }],
    sender: {
      name: "Your Own Shopping Store",
      email: "ashusingh19911082@gmail.com",
    },
    subject,
    htmlContent: `
      <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(135deg, #14b8a6, #0ea5e9); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Your Own Shopping Store</h1>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2 style="margin-top: 0;">Password Reset Request</h2>
            <p style="font-size: 15px; line-height: 1.6;">
              We received a request to reset your password. Click the button below to set a new one:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${fullLink}" target="_blank" rel="noopener noreferrer"
                style="display:inline-block; background:#14b8a6; color:white; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600; font-size:16px;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #555;">
              This link will expire in <strong>15 minutes</strong> for your security.
              If you didn’t request a password reset, you can safely ignore this email.
            </p>

            <p style="margin-top: 30px; font-size: 13px; color: #888;">
              Or, copy and paste this link into your browser:<br/>
              <a href="${fullLink}" style="color: #14b8a6; word-break: break-all;">${fullLink}</a>
            </p>
          </div>

          <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            &copy; ${new Date().getFullYear()} Your Own Shopping Store. All rights reserved.
          </div>
        </div>
      </div>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(email);
    console.log("Brevo email sent to:", to);
  } catch (err) {
    console.error("Brevo email failed:", err);
    throw err;
  }
};
