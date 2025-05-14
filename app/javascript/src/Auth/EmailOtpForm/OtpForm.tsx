import { Box, Button, Stack, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// OTP Form Component
export interface OtpFormProps {
  onError: (error: string | null) => void;
  resend: () => Promise<{ data: any, error: any }>;
  reset: () => void
  submitOtp: (otp: string) => Promise<{ data: any, error: any }>;
}

export const OtpForm = ({ onError, resend, reset, submitOtp }: OtpFormProps) => {
  const [resent, setResent] = useState(false);

  type OtpFormValues = {
    otp: string;
  };

  const { 
    control, 
    handleSubmit,
    formState: { errors, isSubmitted },
    setError,
    setValue
  } = useForm<OtpFormValues>({
    defaultValues: {
      otp: ""
    },
    mode: "onChange"
  });

  const onSubmit = async(form: OtpFormValues) => {
    try {
      const { data, error } = await submitOtp(form.otp);
      if (error) throw error;
      return { data, error: null }
    } catch (e) {
      console.error(e);
      setError('otp', { message: e.message });
      return { data: null, error: e }
    }
  };

  const onResend = () => {
    setResent(true);
  }

  const handleResend = async () => {
    onError(null)
    setError("otp", null)

    try {
      const { error } = await resend()
      if (error) {
        throw error;
      } else {
        // disable resend for 2 minutes
        setTimeout(() => {
          setResent(false);
        }, 120000);
      }
      setValue("otp", "");
    } catch (e) {
      onError(e.message);
    }
  }

  const onReset = () => {
    reset()
  }

  useEffect(() => {
    if (resent) {
      handleResend()
    }
  }, [resent]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={2}>
        <Typography variant='body2'>Check your email for a 4-digit verification code and enter it here.</Typography>
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "OTP is required",
            validate: {
              isFourDigits: value => /^\d{4}$/.test(value) || "Verification code must be 4 digits"
            }
          }}
          render={({ field }) => (
            <MuiOtpInput
              autoFocus={true}
              value={field.value}
              length={4}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              TextFieldsProps={{
                variant: "outlined"
              }}
            />
          )}
        />
        {isSubmitted && errors.otp && (
          <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px" }}>
            {errors.otp.message}
          </p>
        )}

        <Button
          variant="contained"
          type="submit"
          fullWidth
        >
          Verify
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="text"
          onClick={onResend}
          disabled={resent}
        >
          {resent ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                Resent
              </Typography>
              <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
            </Box>
          ) : "Resend"}
        </Button>
        <Button
          variant="text"
          onClick={onReset}
        >
          Reset
        </Button>
      </Box>
    </form>
  );
};