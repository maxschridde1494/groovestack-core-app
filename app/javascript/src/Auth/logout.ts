import { generateFetchRequest } from "../clients/fetch"

export const logout = async () => {
  const request = generateFetchRequest({
    method: 'DELETE',
    path: '/users/sign_out',
  })

  return fetch(request)
}