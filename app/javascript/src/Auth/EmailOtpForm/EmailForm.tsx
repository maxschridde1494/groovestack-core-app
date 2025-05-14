import { Button, OutlinedInput, Stack } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

// Email Form Component
export interface EmailFormProps {
  disabled?: boolean;
  submitEmail: (email?: string) => Promise<{ data: any, error: any }>;
}

export const EmailForm = ({ disabled = false, submitEmail }: EmailFormProps) => {
  type EmailFormValues = {
    email: string;
  };

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitted },
    setError
  } = useForm<EmailFormValues>({
    defaultValues: {
      email: ""
    },
    mode: "onChange"
  });

  const onSubmit = async (form: EmailFormValues) => {
    try {
      const { data, error } = await submitEmail(form.email);
      if (error) throw error;
      return { data, error: null }
    } catch (e) {
      console.error(e);
      setError('email', { message: e.message });
      return { data: null, error: e }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address. Expected format: firstlast@domain.com"
            }
          }}
          render={({ field }) => (
            <OutlinedInput
              {...field}
              fullWidth
              placeholder="Email"
              type="email"
              disabled={disabled}
            />
          )}
        />
        {isSubmitted && errors.email && (
          <p style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px" }}>
            {errors.email.message}
          </p>
        )}

        {!disabled && (
          <Button
            variant="contained"
            type="submit"
            fullWidth
          >
            Sign In
          </Button>
        )}
      </Stack>
    </form>
  );
};