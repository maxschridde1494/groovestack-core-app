import PubSub from "pubsub-js";

interface BrowserProps {
  name: "facebook" | "instagram" | "other";
  embedded: boolean;
}

export function detectEmbeddedBrowser(): BrowserProps {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  if (/Instagram/i.test(ua)) {
    return { name: "instagram", embedded: true };
  } else if (/FBAN|FBAV/i.test(ua)) {
    return { name: "facebook", embedded: true };
  } else {
    return { name: "other", embedded: false };
  }
}

export class AuthEvents {
  static LoginAttempt = "login-attempt";
  static Login = "login-success";
  static LoginFail = "login-fail";
  static Logout = "logout";
}

export const logAuthEvent = (provider: string, event: string, data: any) => {
  const topic = `user.auth.${provider}.${event}`;
  PubSub.publish(topic, data);
};
