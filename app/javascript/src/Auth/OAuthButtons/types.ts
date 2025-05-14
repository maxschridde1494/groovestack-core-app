import { OAuthProvider } from '../../hooks/useProviders'

export interface User {
  id: string;
  email: string;
  roles: string[];
}

export enum OAuthButtonMode {
  FORM = "form",
  BUTTON = "button",
}

export interface OAuthButtonProps {
  providerId: string;
  name: string;
  path?: string;
  mode?: OAuthButtonMode;
  status?: string;
  label?: string;
  setDisabled: (disabled: boolean) => void;
  disabled: boolean;
}

export type SpecializedOnSuccessHandler = (data: User) => void;
export type SpecializedOnErrorHandler = (
  err: Error,
  meta?: Record<string, unknown>
) => void;

export interface SpecializedOAuthButtonProps
  extends Omit<OAuthButtonProps, "providerId"> {
  onSuccess?: SpecializedOnSuccessHandler;
  onError?: SpecializedOnErrorHandler;
  credentials?: {
    APP_ID?: string;
  };
}

export type SpecializedOAuthButton = (
  props: SpecializedOAuthButtonProps
) => JSX.Element;

export interface OAuthButtonsProps {
  providers: OAuthProvider[];
  specialized?: {
    facebook?: {
      credentials: {
        APP_ID: string;
      };
      onSuccess?: SpecializedOnSuccessHandler;
      onError?: SpecializedOnErrorHandler;
    };
  };
}
