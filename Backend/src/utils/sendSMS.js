import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendSMS = async (phone) => {
  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/AUTOGEN`
    );

    if (response.data.Status !== "Success") return null;

    return response.data.Details; // sessionId
  } catch (err) {
    console.error("2Factor Send SMS Error:", err.response?.data || err);
    return null;
  }
};
