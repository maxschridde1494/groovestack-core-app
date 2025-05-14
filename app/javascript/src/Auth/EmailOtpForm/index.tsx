import { useState } from "react";
import { Box, Stack } from "@mui/material";

import { EmailForm } from "./EmailForm";
import { OtpForm } from "./OtpForm";

type FormState = "emailCollect" | "otpCollect";

export interface EmailOtpFormProps {
  onSubmitEmail: (email: string) => Promise<{ data: any, error: any }>;
  onSubmitCode: (otpFormArgs: { email: string, otp: string }) => Promise<{ data: any, error: any }>;
  onSuccess: (data: any) => Promise<void>;
}

// Main EmailOtpForm Component
export const EmailOtpForm = ({ onSubmitEmail, onSubmitCode, onSuccess }: EmailOtpFormProps) => {
  const [formState, setFormState] = useState<FormState>("emailCollect");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmitEmail = async (newEmail?: string) => {
    if (newEmail) {
      setEmail(newEmail);
    }

    let val = newEmail || email;

    try {
      const { data, error } = await onSubmitEmail(val);
      if (!error) setFormState("otpCollect");
      return { data, error }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      return { data: null, error: e }
    }
  }

  const handleSubmitOtp = async (otp: string) => {
    try {
      const { data, error } = await onSubmitCode({ email, otp });
      if (!error) onSuccess(data?.resource || data)
      return { data, error }
    } catch (e: any) {
      console.error(e);
      setError(e.message);
      return { data: null, error: e }
    }
  };

  const handleReset = () => {
    setFormState("emailCollect");
    setError(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
        {error && <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px" }}>{error}</p>}

        <EmailForm 
          disabled={formState === "otpCollect"}
          submitEmail={handleSubmitEmail}
        />
        
        {formState === "otpCollect" && (
          <OtpForm 
            onError={setError}
            resend={handleSubmitEmail}
            reset={handleReset}
            submitOtp={handleSubmitOtp}
          />
        )}
      </Stack>
    </Box>
  );
};