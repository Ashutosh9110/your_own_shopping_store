import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_SECRET
);

export const sendMail = async ({ to, subject, htmlContent }) => {
  const email = {
    to: [{ email: to }],
    sender: {
      name: "Your Own Shopping Store",
      email: "ashusingh19911082@gmail.com",
    },
    subject,
    htmlContent,
  };

  try {
    await apiInstance.sendTransacEmail(email);
    console.log("Brevo email sent to:", to);
  } catch (err) {
    console.error("Brevo email failed:", err);
    throw err;
  }
};
