import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const verifySMS = async (sessionId, otp) => {
  try {
    const response = await axios.get(
      `https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/VERIFY/${sessionId}/${otp}`
    );

    return response.data.Status === "Success";
  } catch (err) {
    console.error("2Factor Verify OTP Error:", err);
    return false;
  }
};
