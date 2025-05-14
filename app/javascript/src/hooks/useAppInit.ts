import { useEffect, useMemo, useState } from "react";
import { AuthProvider, DataProvider, Store } from "react-admin";
// import { Auth } from "@groovestack/auth";
import { gql } from "@apollo/client";

import { buildDataProvider } from "../dataProvider";
import { client } from "../clients/apollo";
// import { useAppConfig } from "../AppConfig";
import { authProviderFactory } from "../Auth/authProvider";

const QUERY_APP_CONFIG = gql`
  query AppConfig {
    AppConfig
  }
`;

let activeFetchAppConfigRequest: Promise<any> | null = null

export const useAppInit = (store: Store) => {
  const [dataProvider, setDataProvider] = useState<DataProvider>();
  const [authProvider, setAuthProvider] = useState<AuthProvider | undefined>();
  const [appConfig, setAppConfig] = useState();
  const [errors, setErrors] = useState<string[]>([])
  // const { config: appCredentials } = useAppConfig();

  const credentials: any = useMemo(() => ({
    clearCurrentUser: () => store.removeItem("currentUser"),
    getCurrentUser: () => store.getItem("currentUser"),
    setCurrentUser: (r: { [k: string]: any }) =>
      store.setItem("currentUser", r),
    clearAuthHeaders: () => store.removeItem("authCredentials"),
    getAuthHeaders: () => store.getItem("authCredentials"),
    setAuthHeaders: (headers: { [k: string]: any }) =>
      store.setItem("authCredentials", headers),
    // // use localstorage for app config so it persists beyond logout
    clearAppConfig: () => store.removeItem("groovestackAppConfig"),
    getAppConfig: () => store.getItem("groovestackAppConfig"),
    setAppConfig: (appConfig: { [k: string]: any }) => store.setItem("groovestackAppConfig", appConfig)
  }), [store])

  const initAppConfig = async () => {
    if (!activeFetchAppConfigRequest) {
      activeFetchAppConfigRequest = client
      .query({ query: QUERY_APP_CONFIG })
      .then(({ data: { AppConfig } }) => {
        setAppConfig(AppConfig)
        activeFetchAppConfigRequest = null
      }).catch((error) => {
        setErrors((prev) => [...prev, error.message])
        activeFetchAppConfigRequest = null
      })
    }
  }

  const initDataProvider = async () => {
    try {
      const graphQlDataProvider = await buildDataProvider()
      setDataProvider(() => graphQlDataProvider)
    } catch(error: any) {
      setErrors((prev) => [...prev, error.message])
    }
  }

  const initAuthProvider = async () => {
    try {
      const aP = await authProviderFactory({
        client,
        credentials,
        dataProvider: dataProvider as DataProvider,
      })
      setAuthProvider(aP)
    } catch(error: any) {
      setErrors((prev) => [...prev, error.message])
    }
  }

  useEffect(() => {
    if (appConfig) {
      credentials.setAppConfig(appConfig)
    }
  }, [appConfig])

  useEffect(() => {
    if (dataProvider) 
      initAuthProvider()
  }, [dataProvider])

  useEffect(() => {
    initAppConfig()
    initDataProvider()
  }, []);

  return {
    loading: !(appConfig && authProvider && dataProvider),
    authProvider,
    dataProvider,
    appConfig,
    // appCredentials,
    authCredentials: credentials,
    errors,
    rebuildDataProvider: initDataProvider,
    refetchAppConfig: initAppConfig
  };
};
