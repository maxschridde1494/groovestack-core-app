import { detectEmbeddedBrowser } from "./authUtil";
import { OAuthButton } from "./Button";
import { SpecializedOAuthButton } from "./types";

declare global {
  interface Window {
    opera?: any;
  }
}

export const GoogleOAuthButton: SpecializedOAuthButton = ({
  onSuccess: _onSuccess,
  onError: _onError,
  credentials: _credentials,
  ...btnProps
}) => {
  if (detectEmbeddedBrowser().embedded) return null;

  return <OAuthButton providerId="google" {...btnProps} />;
};
