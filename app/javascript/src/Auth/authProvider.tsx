import { DataProvider, GetOneResult, UserIdentity } from 'react-admin'
// import { Auth } from '@groovestack/auth';

import { ApolloClientType } from '../clients/apollo'
// import { notifyError } from 'bugsnag';
import { logout } from './logout';

const parseErrorType = (error: any) => {
  try {
    const graphQLErrors = error?.graphQLErrors || error?.body?.graphQLErrors || [];
    const graphQLAuthError = graphQLErrors.find((e) => e.extensions?.code === 'AUTHENTICATION_ERROR');
  
    return {
      graphQLErrors,
      authError: !!graphQLAuthError || [401, 403].includes(error?.status) || [401, 403].includes(error?.networkError?.statusCode),
      graphQLAuthError
    };
  } catch(e: any) {
    console.error('Error parsing error type', e)
    return {
      graphQLErrors: [],
      authError: false,
      graphQLAuthError: null
    }
  }
};

export type LoginCredentials = { email: string; password: string }
export type RegistrationCredentials = LoginCredentials & { name: string }

let activeFetchCurrentUserRequest: Promise<GetOneResult<any>> | null = null
let activeLogoutRequest: Promise<any> | null = null

export const authProviderFactory = async ({ 
  client, 
  credentials, 
  dataProvider
}: {
  client: ApolloClientType;
  credentials: any; //typeof Auth.Credentials;
  dataProvider: DataProvider;
}) => {
  if (!(client && credentials && dataProvider)) throw new Error('authProviderFactory is not fully implemented yet. client, credentials and dataProvider args must be provided')

  const fetchCurrentUser = () => {
    if (activeFetchCurrentUserRequest) {
      return activeFetchCurrentUserRequest
    }

    activeFetchCurrentUserRequest = dataProvider.getOne(
      'User',
      {
        id: 'me',
        // meta: {
        //   extra_fields: [
        //     { profile_image: ['id', 'thumbnail_url', 'src_set'] }
        //   ]
        // },
      },
    )

    return activeFetchCurrentUserRequest
  }

  const hydrateCurrentUser = async () => {
    try {
      const { data } = await fetchCurrentUser()

      credentials.setCurrentUser(data)
    } catch(error: any) {
      const { graphQLAuthError, graphQLErrors } = parseErrorType(error)

      console.error('Error hydrating current resource', graphQLAuthError?.message || graphQLErrors?.[0]?.message || error?.message)
    }

    activeFetchCurrentUserRequest = null
  }

  const getIdentity = async () => {
    let currentUser = credentials.getCurrentUser() as UserIdentity
    if (currentUser) return currentUser


    await hydrateCurrentUser()

    return credentials.getCurrentUser() as UserIdentity
  }

  const clearCredentials = () => {
    credentials.clearCurrentUser()
    credentials.clearAuthHeaders()
  }

  return {
    // send username and password to the auth server and get back credentials
    login: async (_props: LoginCredentials): Promise<void | any> => {
      // NOTE: this should never get called since we only use OAuth + ROTP
      throw new Error('Error logging in')
    },
    // when the dataProvider returns an error, check if this is an authentication error
    checkError: async (error: any) => {
      // called when dataProvider returns an error
      // rejected promise automatically calls authProvider.logout()
      const { graphQLErrors, authError, graphQLAuthError } = parseErrorType(error)

      if (graphQLErrors.length > 0 && !graphQLAuthError) {
        console.error('[checkError] graphQLErrors', graphQLErrors)
      //   notifyError(error, function (event) {
      //     event.context = 'dataprovider error'
      //     event.addMetadata('gql-error', error.body)
      //   })
      }


      if (authError) throw new Error('Please login to continue')
      
      return
    },
    // when the user navigates, make sure that their credentials are still valid
    checkAuth: async () => {
      // const serverLoggedOut = window.location.href.includes('logged_out=true')
      
      // if (serverLoggedOut) {
      //   clearCredentials()
      //   throw new Error('Please login to continue')
      // }

      let currentUser = credentials.getCurrentUser()

      if (!currentUser){
        await hydrateCurrentUser()
        currentUser = credentials.getCurrentUser()
      } 

      if (!currentUser) throw new Error('Please login to continue')

      return
    },
    handleCallback: async() => {
      const serverLoggedOut = window.location.href.includes('logged_out=true')

      if (serverLoggedOut) {
        clearCredentials()
        return '/login'
      }

      return
    },
    logout: async (params: { redirect?: string; skip_server?: boolean }) => {
      clearCredentials()
      // client.resetStore() // https://www.apollographql.com/docs/react/networking/authentication/#reset-store-on-logout

      // if (params?.skip_server || !!activeLogoutRequest) return params?.redirect

      activeLogoutRequest = logout()

      try {
        const response = await activeLogoutRequest
        if (response.status != 204 && response.status != 200 && response.status != 404) {
          throw new Error('Error logging out')
        }
      } catch(e: any) {
        console.error(e)
        activeLogoutRequest = null
        throw new Error(e.message || 'Error logging out')
      }
      
      activeLogoutRequest = null

      return params?.redirect
    },
    getIdentity,
    getPermissions: async () => {
      const currentUser = await getIdentity()

      return currentUser?.['roles'] || []
    },
  }
}