import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser, Layout, localStorageStore, Loading, LoginComponent, useRedirect } from 'react-admin';

import { Auth } from './Auth'
import { useAppInit } from './hooks/useAppInit';
import { useEmailOtp } from './Auth/EmailOtpForm/useEmailOtp';
import { createContext, useContext } from 'react';

export const AppContext = createContext<{
  authCredentials: any;
  appConfig: any;
  refetchAppConfig: () => void;
}>({
  authCredentials: null,
  appConfig: null,
  refetchAppConfig: () => {}
})

const DashLoginPage: LoginComponent = (props) => {
  const { onSubmitEmail, onSubmitCode } = useEmailOtp()
  const redirect = useRedirect()
  const { authCredentials, appConfig } = useContext(AppContext)
  // const { rebuildDataProvider } = useContext(DashAppContext)
  const redirectToDashboard = () => redirect('/')

  const onAuthSuccess = async (data: any) => {
    // await rebuildDataProvider()
    authCredentials.setCurrentUser(data)
    redirectToDashboard()
  }

  if (!appConfig) return <Loading />

  return (
    <Auth.LoginPage 
      {...props}
      emailOtpFormProps={{
        onSubmitEmail,
        onSubmitCode,
        onSuccess: onAuthSuccess
      }}
    />
  )
}

export const STORE_VERSION = '1.0.0'
export const STORE_KEY = `groovestack-core-${STORE_VERSION}`

export const store = localStorageStore(STORE_VERSION, STORE_KEY);

export const App = () => {
  const { 
    loading: appLoading, 
    authProvider, 
    dataProvider, 
    appConfig,
    authCredentials,
    refetchAppConfig,
    // rebuildDataProvider 
  } = useAppInit(store);

  if (appLoading) return <Loading />;
  
  return (
    <AppContext.Provider value={{ authCredentials, refetchAppConfig, appConfig }}>
      <Admin
        authProvider={authProvider}
        dataProvider={dataProvider}
        layout={Layout}
        loginPage={DashLoginPage}
        store={store}
      >
        <Resource
          name="User"
          list={ListGuesser}
          edit={EditGuesser}
          show={ShowGuesser} 
        />
      </Admin>
    </AppContext.Provider>
  );
};