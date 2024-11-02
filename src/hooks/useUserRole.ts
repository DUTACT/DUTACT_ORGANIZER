import useLocalStorage from 'src/hooks/useLocalStorage'
import { parseJwt } from 'src/utils/common'

export function useUserRole(): string {
  const [accessToken, _] = useLocalStorage<string>('access_token')
  return parseJwt(accessToken)?.scp[0]
}
