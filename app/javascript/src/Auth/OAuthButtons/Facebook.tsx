import { useEffect, useMemo, useState } from "react";

import { SpecializedOAuthButton } from "./types";
import { AuthEvents, detectEmbeddedBrowser, logAuthEvent } from "./authUtil";
import { AuthDiagnostics } from "./AuthDiagnostics";
import FacebookLogin, {
  ProfileSuccessResponse,
} from "@greatsumini/react-facebook-login";

import { generateFetchRequest } from "../../../../shared/clients/fetch";

// const SCOPES = "email,public_profile";
// declare global {
//   interface Window {
//     FB?: any;
//     fbAsyncInit?: () => void;
//     handleFBLogin?: (any) => void;
//   }
// }

export const FacebookOAuthButton: SpecializedOAuthButton = ({
  path,
  // name,
  setDisabled,
  onSuccess: onAuthedSuccess,
  onError: onAuthedError,
  credentials,
  // ...btnProps
}) => {
  // const [loginTimestamp] = useState(Date.now()); // to track the login attempt time
  const [user, setUser] = useState<ProfileSuccessResponse | undefined>();
  // const [authResponse, setAuthResponse] = useState<any>();
  const browser = detectEmbeddedBrowser();
  const debugMode = new URLSearchParams(window.location.search).has(
    "authdebug"
  );

  const FACEBOOK_AUTH =
    browser.name == "other" ? "facebook" : `facebook[${browser.name}]`;

  const callbackUrl = useMemo(() => {
    let url: URL;
    try {
      url = new URL(path); // path is a full url
      path = url.pathname;
    } catch (e) {
      url = new URL(window.location.href); // path is not a full url
    }

    return new URL(`${url.origin}${path}/callback`.replace(/\/\//g, "/"));
  }, [path]);

  // const showFacebookButton = debugMode || browser.name == "facebook";
  // const showStandardButton = debugMode || !showFacebookButton;

  const userAuthedCallback = async ({ user }) => {
    logAuthEvent(FACEBOOK_AUTH, "oa.start", {});

    const { name, email, id: uid } = user;

    if (!name || !uid) {
      logAuthEvent(FACEBOOK_AUTH, "oa.validation.error", {
        missingFields: {
          name: !name,
          email: !email,
          uid: !uid,
        },
      });

      // setDisabled(false);

      const missingKeys = Object.keys(user).filter((key) => !user[key]);

      throw new Error(
        JSON.stringify({
          keys: Object.keys(user),
          missing: missingKeys,
        })
      );

      // return;
    }

    // Could still be missing email, but continue

    const request = generateFetchRequest({
      headers: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      baseUrl: callbackUrl.host,
      path: callbackUrl.pathname,
      body: JSON.stringify({
        omniauth: {
          provider: "facebook",
          uid,
          info: { email, name },
          raw_info: authResponse,
        },
      }),
    });

    logAuthEvent(FACEBOOK_AUTH, "oa.request", {});
    const result = await fetch(request);

    const data = await result.json();
    logAuthEvent(FACEBOOK_AUTH, "oa.data", data);

    if (result.ok) {
      logAuthEvent(FACEBOOK_AUTH, AuthEvents.Login, {});
      if (onAuthedSuccess) onAuthedSuccess(data);
    } else {
      const error = new Error(
        data?.errors || data?.error || "error occurred on facebook login"
      );
      logAuthEvent(FACEBOOK_AUTH, AuthEvents.LoginFail, {
        error: error.message,
      });
      if (onAuthedError) onAuthedError(error);
      else console.error(error);
      setDisabled(false);
    }
  };

  useEffect(() => {
    console.log("user updated", user);
    if (user) {
      console.log("useeffect - calling userAuthedCallback");
      userAuthedCallback({ user });
    }
  }, [user]);

  const currentUrl = new URL(window.location.href);
  const samePage = `${currentUrl.origin}${currentUrl.pathname}`;

  return (
    <>
      {/* {showFacebookButton && (
        <div
          className="fb-login-button"
          data-width="100%"
          data-size="large"
          data-scope={SCOPES}
          data-button-type=""
          data-layout=""
          data-auto-logout-link="false"
          data-use-continue-as="true"
          data-onlogin="handleFBLogin"
        ></div>
      )} */}

      {/* {showStandardButton && (
        <OAuthButton
          providerId="facebook"
          mode={OAuthButtonMode.BUTTON}
          path={path}
          name={name}
          onClick={onLogin}
          setDisabled={setDisabled}
          status={loginStatus?.status}
          {...btnProps}
        />
      )} */}

      <FacebookLogin
        appId={credentials.APP_ID}
        initParams={{ version: "v21.0" }}
        // autoLoad={browser.name == "facebook"}

        // dialogParams={{
        //   redirect_uri:
        //     browser.name == "facebook" ? samePage : callbackUrl.toString(),
        //   state: "facebookdirect",
        // }}

        // TEST CONFIG
        // useRedirect
        // dialogParams={{
        //   redirect_uri: callbackUrl.toString(),
        //   state: "facebookdirect",
        // }}
        // END TEST CONFIG

        onSuccess={(response) => {
          console.log("FB OnSuccess", JSON.stringify(response));
          // logAuthEvent(FACEBOOK_AUTH, "fb-login", response);
          // setAuthResponse(response);
        }}
        onFail={(error: any) => {
          console.log("FB OnFail", JSON.stringify(error));
          // // setDebugResponse({path: 'FacebookLogin.onFail', response});
          // logAuthEvent(FACEBOOK_AUTH, AuthEvents.LoginFail, {
          //   error: error?.message,
          // });
        }}
        onProfileSuccess={(response) => {
          console.log("FB OnProfileSuccess", JSON.stringify(response));
          // logAuthEvent(FACEBOOK_AUTH, "fb-me", response);
          setUser(response);
        }}
      >
        FacebookLogin Button v2
      </FacebookLogin>
      {debugMode && (
        <>
          <AuthDiagnostics
            values={[
              // {
              //   name: "Facebook Auth Response",
              //   value: JSON.stringify(loginStatus),
              // },
              { name: "Browser", value: `${browser.name}` },
              { name: "Path", value: path },
              { name: "Callback", value: callbackUrl.toString() },
            ]}
          />
        </>
      )}
    </>
  );
};

// Standard Facebook Login Button Code
// SETUP: https://developers.facebook.com/apps/1060221779235320/use_cases/customize/?use_case_enum=FB_LOGIN&business_id=156855232125696&selected_tab=quickstart&product_route=fb-login
//
// <div id="fb-root"></div>
// <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0&appId=611558624921293"></script>
//
// <div class="fb-login-button" data-width="100" data-size="" data-button-type="" data-layout="" data-auto-logout-link="false" data-use-continue-as="true"></div>
