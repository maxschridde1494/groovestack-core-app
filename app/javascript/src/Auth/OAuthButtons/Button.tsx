import { useMemo } from "react";
import { Box, Typography, Button, Input, ButtonProps } from "@mui/material";

import { csrfToken } from "../index";
import { OAuthIcons } from "./Icons";
import { OAuthButtonMode, OAuthButtonProps } from "./types";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { logAuthEvent, AuthEvents, detectEmbeddedBrowser } from "./authUtil";

export const OAuthButton = ({
  providerId,
  path,
  name,
  mode = OAuthButtonMode.FORM,
  setDisabled,
  disabled,
  status,
  label,
  ...props
}: OAuthButtonProps & ButtonProps) => {
  const browser = detectEmbeddedBrowser();
  const LOG_KEY =
    browser.name == "other" ? providerId : `${providerId}[${browser.name}]`;

  const btnProps: ButtonProps = useMemo(
    () => ({
      variant: "outlined",
      fullWidth: true,
      id: `gs-auth-${providerId}-btn`,
      sx: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 1,
        borderRadius: "999px",
      },
      ...props,
    }),
    [providerId, path, name, mode, props]
  );

  if (mode === OAuthButtonMode.FORM) btnProps["type"] = "submit";

  const btn = useMemo(
    () => (
      <Button
        startIcon={<OAuthIcons provider={providerId} />}
        endIcon={
          status == "connected" && <ArrowRightIcon titleAccess={status} />
        }
        // href={path}
        {...btnProps}
      >
        <Typography fontWeight="bold" color="text.primary">
          {label || `Sign in with ${name}`}
        </Typography>
      </Button>
    ),
    [btnProps]
  );

  const onSubmit = () => {
    logAuthEvent(LOG_KEY, AuthEvents.LoginAttempt, {});
    setDisabled(true);
  };

  const id = `gs-auth-${providerId}`;

  if (mode === OAuthButtonMode.BUTTON)
    return <Box id={id}>{btn}</Box>;

  // return ()

  return (
    <form
      id={id}
      action={path}
      method="post"
      onSubmit={onSubmit}
    >
      {btn}
      <Input
        type="hidden"
        name="authenticity_token"
        value={csrfToken()}
        style={{ display: "none" }}
      />
    </form>
  );
};
