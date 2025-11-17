import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

export const sendSMS = async (phone, message) => {
  try {
    let formattedPhone = phone;

    if (!phone.startsWith("+")) {
      formattedPhone = "+91" + phone;
    }
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: formattedPhone,
    });
    return true;
  } catch (err) {
    console.error("SMS sending failed:", err);
    return false;
  }
};

