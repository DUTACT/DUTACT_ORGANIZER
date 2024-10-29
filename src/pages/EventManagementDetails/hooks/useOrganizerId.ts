import useLocalStorage from 'src/hooks/useLocalStorage'
import { parseJwt } from 'src/utils/common'

export function useOrganizerId(): number {
  const [accessToken, _] = useLocalStorage<string>('access_token')
  return parseJwt(accessToken)?.organizerId
}
