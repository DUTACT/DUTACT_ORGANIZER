import { ApiError } from 'src/types/client.type'
import { useOrganizerId } from 'src/hooks/useOrganizerId'
import { getOrganizerProfile } from 'src/apis/account'
import { Profile, ProfileBody } from 'src/types/account.type'
import { updateProfile } from 'src/apis/account/account.mutation'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { SUCCESS_MESSAGE } from 'src/constants/message'

interface ProfileResult {
  profile: Profile | undefined
  isLoading: boolean
  error: ApiError | null
  updateAvatarMutation: UseMutationResult<Profile, ApiError, Partial<ProfileBody>>
  updatePersonalInformationMutation: UseMutationResult<Profile, ApiError, Partial<ProfileBody>>
}

export function useProfile(): ProfileResult {
  const organizerId = useOrganizerId()
  const queryClient = useQueryClient()

  const { data: profile, isLoading, error } = getOrganizerProfile(organizerId)

  const updateProfileData = (profile: Profile) => {
    queryClient.setQueryData<Profile>(['getOrganizerProfile', organizerId], () => profile)
  }

  const updateAvatarMutation = updateProfile(organizerId, {
    onSuccess: (data) => {
      updateProfileData(data)
      toast.success(SUCCESS_MESSAGE.UPLOAD_AVATAR)
    }
  })

  const updatePersonalInformationMutation = updateProfile(organizerId, {
    onSuccess: (data) => {
      updateProfileData(data)
      toast.success(SUCCESS_MESSAGE.UPDATE_PERSONAL_INFORMATION)
    }
  })

  return {
    profile,
    isLoading,
    error,
    updateAvatarMutation,
    updatePersonalInformationMutation
  }
}
