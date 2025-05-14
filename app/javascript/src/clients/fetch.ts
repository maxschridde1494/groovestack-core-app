interface GenerateFetchClientProps {
  body?: string
  headers?: { [key: string]: string }
  method: string
  path: string
  baseUrl?: string
}

export const generateFetchRequest = ({
  body,
  headers = {},
  method,
  path,
  baseUrl = window.location.host,
}: GenerateFetchClientProps): Request => {
  const requestArgs: { method: string; headers: Headers; body?: string } = {
    method: method,
    headers: new Headers(
      Object.assign(
        {
          'Content-Type': 'application/json',
        },
        headers
      )
    ),
  }

  if (body) requestArgs.body = body

  const request = new Request(`https://${baseUrl}${path}`, requestArgs)

  return request
}

type SimpleFetchParamsType = { 
  errMsgResolver?: (data: any) => string;
  onError?: (err: Error) => void;
  onSuccess?: (data: any) => void;
  requestWasSuccessful?: (data: any) => boolean; 
  url: string;
}

export const simpleFetch = async ({ errMsgResolver, onError, onSuccess, requestWasSuccessful, url }: SimpleFetchParamsType) => {
  try {
    const response = await fetch(url)
    const data = await response.json()
  
    if (response.status != 200 || (requestWasSuccessful && !requestWasSuccessful(data))) {
      if (errMsgResolver) throw new Error(errMsgResolver(data))
      throw new Error(data.message)
    }

    if (onSuccess) onSuccess(data)
  } catch(e){
    console.error(e)
    if (onError) onError(e)
  }
}
