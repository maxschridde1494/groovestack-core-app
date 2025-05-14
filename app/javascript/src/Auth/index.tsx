import { LoginPage } from "./LoginPage";
import { OAuthIcons } from "./OAuthButtons/Icons";

export const csrfToken = () => {
  const meta = document.querySelector('meta[name=csrf-token]') as any
  return meta && meta['content']
}

export class Auth {
  static LoginPage = LoginPage;
  static OAuthIcons = OAuthIcons;
  static getCrsfToken = csrfToken;
}