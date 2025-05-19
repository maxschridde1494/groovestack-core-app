// import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Link,
  Avatar,
  // Alert,
  // AlertTitle,
} from "@mui/material";
// import { useRedirect } from "react-admin";

import { OAuthButtons } from "../OAuthButtons";
import { useProviders } from "../../hooks/useProviders";
// import { useAppConfig } from "../../../AppConfig";
// import { useServerRedirectSearchParams } from "../../../shared/hooks/useServerRedirectSearchParams";
import { EmailOtpForm, EmailOtpFormProps } from "../EmailOtpForm";

export interface LoginPageProps {
  header?: string;
  subheader?: string;
  oauth?: boolean;
  emailOtp?: boolean;
  emailOtpFormProps: EmailOtpFormProps;
}

export const LoginPage = ({
  header = "Login or Create an Account",
  subheader,
  oauth = true,
  emailOtp = true,
  emailOtpFormProps,
}: LoginPageProps) => {
  // const redirect = useRedirect();
  const { oauth: providers } = useProviders();
  console.log("LoginPage: providers", providers)
  // const [errors, setErrors] = useState<{ key: string; msg: string }[]>();
  // const { errors: serverRenderedErrors } = useServerRedirectSearchParams({
  //   removeParamsOnMount: true,
  // });
  // const { config: appCredentials, loading: loadingAppCredentials } =
  //   useAppConfig();

  // const onCustomLoginSuccess = (_data) => {
  //   redirect("/dashboard");
  // };

  // const onCustomLoginErrors = (errors) => {
  //   setErrors([{ key: "Login Error", msg: errors.first.message }]);
  // };

  // const renderErrors = () => {
  //   if (!errors) return null;

  //   return (
  //     <div>
  //       {errors.map(({ key, msg }) => (
  //         <Alert key={key} severity="error" sx={{ mb: 2 }}>
  //           <AlertTitle>{key}</AlertTitle>
  //           {msg}
  //         </Alert>
  //       ))}
  //     </div>
  //   );
  // };

  // useEffect(() => {
  //   setErrors(serverRenderedErrors);
  // }, [serverRenderedErrors]);

  // if (loadingAppCredentials) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      width="100%"
      sx={{
        my: 2,
        ml: "auto",
        mr: "auto",
        maxWidth: 400,
        p: 2,
        gap: 4,
        backgroundColor: "transparent",
      }}
      // component={Card}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Avatar src="images/talysto.png" sx={{ width: 40, height: 40 }} />
          <Box>
            <Typography variant="h4" color="text.primary">
              Groovestack Core
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            PostgreSQL, Rails, GraphQL and React-Admin for Fullstack Applications
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {header}
        </Typography>
        {subheader && (
          <Typography variant="body1" color="text.secondary">
            {subheader}
          </Typography>
        )}
      </Box>
      <Box sx={{ width: "100%" }}>
        {/* {errors && renderErrors()} */}
        {oauth && (
          <OAuthButtons
            providers={providers}
            // specialized={{
            //   facebook: {
            //     onSuccess: onCustomLoginSuccess,
            //     onError: onCustomLoginErrors,
            //     credentials: {
            //       APP_ID: appCredentials?.data?.FACEBOOK_OAUTH?.APP_ID,
            //     },
            //   },
            // }}
          />
        )}
        {oauth && emailOtp && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, my: 2 }}>
            <Typography variant="body1" color="text.secondary">
              or
            </Typography>
          </Box>
        )}
        {emailOtp && <EmailOtpForm {...emailOtpFormProps} />}
      </Box>
      <Box width="100%">
        <Typography variant="body2" color="text.secondary">
          By signing up, you agree to the{" "}
          <Link
            href="#"
            target="_blank"
            rel="noreferrer"
            color="primary"
          >
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            target="_blank"
            rel="noreferrer"
            color="primary"
          >
            Privacy Policy
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
};
