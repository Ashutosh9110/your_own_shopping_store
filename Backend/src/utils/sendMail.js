import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_SECRET
);

export const sendMail = async (to, subject, resetLink) => {
  const email = {
    to: [{ email: to }],
    sender: { name: "Your Own Shopping Store", email: "no-reply@yourownstore.com" },
    subject,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to set a new one:</p>
        <a href="${resetLink}" style="background:#007bff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
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
