import { generateFetchRequest } from "../../clients/fetch";
import { useCallback } from "react";

export const useEmailOtp = () => {
  const generateSubmitEmailRequest = useCallback(({ email, remember_me }: { email: string, remember_me: boolean }) => {
    return generateFetchRequest({
      body: JSON.stringify({
        user: { email, remember_me },
      }),
      method: 'POST',
      path: '/users/sign_in.json',
    })
  }, [])

  const generateSubmitCodeRequest = useCallback(({ email, remember_me, token }: { email: string, remember_me: boolean, token: string }) => {
    return generateFetchRequest({
      body: JSON.stringify({
        user: { email, token, remember_me },
      }),
      method: 'POST',
      path: '/users/magic_link.json',
    })
  }, [])

  const handleSubmit = useCallback(async (request) => {    
    try {

      const response = await fetch(request)
      const data = await response.json()

      if (response.status != 200) throw new Error(data?.error || data?.message || data?.[0]?.message || 'Error submitting form')

      return { data, error: null }
    } catch (e) {
      return { data: null, error: e }
    }
  }, [])

  const onSubmitEmail = useCallback(async (email: string) => {
    const request = generateSubmitEmailRequest({ email, remember_me: true })

    const { data, error } = await handleSubmit(request)
    
    return { data, error }
  }, [handleSubmit])

  const onSubmitCode = useCallback(async ({ email, otp }: {email: string, otp: string}) => {
    const request = generateSubmitCodeRequest({ email, remember_me: true, token: otp })

    const { data, error } = await handleSubmit(request)

    return { data, error }
  }, [handleSubmit])

  return {
    onSubmitEmail,
    onSubmitCode
  }
}