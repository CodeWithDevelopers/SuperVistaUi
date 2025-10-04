"use client";
import React, { useEffect, useState } from "react";
import "./otp-verify.css";
import HTTPRequest from "@/services/request";
import { useRouter } from "next/navigation";
import { selfMessage } from "@/components/message/SelfMessage";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState(null);
  const [timer, setTimer] = useState(60); // seconds countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otpEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Timer logic
  useEffect(() => {
    let countdown;
    if (isResendDisabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [isResendDisabled, timer]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = async () => {
    if (!email) return;

    const payload = {
      email,
      verificationCode: otp.join(""),
    };

    try {
      const response = await HTTPRequest().postAction(
        null,
        payload,
        "/auth/otp-verification",
        true
      );

      if (response && response.success && response.code === 200) {
        selfMessage.success(response.message);
        router.push("/dashboard");
      } else {
        selfMessage.error(response?.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("OTP verify error:", error);
    }
  };

  const handleResendOTP = async () => {
    if (isResendDisabled) return;

    try {
      const response = await HTTPRequest().postAction(
        null,
        { email, verificationMethod: "email" },
        "/auth/resend-otp",
        true
      );

      if (response && response.success && response.code === 200) {
        selfMessage.success(response.message);

        // Restart timer after resend
        setTimer(60);
        setIsResendDisabled(true);
      } else {
        selfMessage.error(response?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.log("Error in resend OTP:", error);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-title">OTP Verification</h2>
        <p className="otp-subtitle">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="otp-input"
            />
          ))}
        </div>

        <button className="otp-button" onClick={handleVerify}>
          Verify OTP
        </button>

        <p className="otp-resend">
          {isResendDisabled ? (
            <>
              Resend available in{" "}
              <span style={{ color: "#1890ff" }}>{timer}s</span>
            </>
          ) : (
            <>
              Didn’t receive the code?{" "}
              <span onClick={handleResendOTP} className="resend-link">
                Resend
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
