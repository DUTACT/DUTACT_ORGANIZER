import { ApiError } from 'src/types/client.type'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { getOrganizerProfile } from 'src/apis/account'
import { Profile } from 'src/types/account.type'

interface ProfileResult {
  profile: Profile | undefined
  isLoading: boolean
  error: ApiError | null
}

export function useProfile(): ProfileResult {
  const organizerId = useOrganizerId()

  const { data: profile, isLoading, error } = getOrganizerProfile(organizerId)

  return {
    profile,
    isLoading,
    error
  }
}
