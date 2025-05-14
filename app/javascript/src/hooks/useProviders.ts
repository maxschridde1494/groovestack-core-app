import { useContext, useMemo } from "react";

import { AppContext } from "../App";

export interface OAuthProvider {
  name: string;
  key: string;
  path?: string;
}

export interface OAuthConfigProvider {
  k: string;
  path: string;
}

export interface OAuthConfig {
  enabled: OAuthConfigProvider[];
  configured: OAuthConfigProvider[];
  hidden?: string[];
}



export const useProviders = (oauthConfig?: OAuthConfig) => {
  const { appConfig } = useContext(AppContext)

  let oauth: OAuthConfig | undefined = oauthConfig;

  if (!oauth) oauth = appConfig?.oauth_providers;

  const oauthProviders: OAuthProvider[] = useMemo(() => {
    if (!oauth) return [];

    return oauth.enabled.map(({ k, path }) => ({
      name: k.charAt(0).toUpperCase() + k.slice(1),
      key: k,
      path,
    }));
  }, [oauth]);

  const configuredProviders = useMemo(() => {
    return oauth?.configured?.map(({ k }: { k: string }) => k) || [];
  }, [oauth]);

  const providers = useMemo(() => {
    const configured = oauthProviders.filter((p) => configuredProviders.includes(p.key)).sort((a, b) => {
      if (a.key === 'apple') return -1; // Apple should always be first if available
      if (b.key === 'apple') return 1; // Apple should always be first if available
      if (a.key === 'facebook') return -1; // Facebook should always be before Google if available
      if (b.key === 'facebook') return 1; // Facebook should always be before Google if available
      if (a.key === 'google') return -1; // Google should always be last if available
      if (b.key === 'google') return 1; // Google should always be last if available
    })

    if (!oauth?.hidden) return configured

    return configured.filter((p) => !oauth?.hidden?.includes(p.key))
  }, [oauth?.hidden, configuredProviders]);

  return {
    oauth: providers
  }
}