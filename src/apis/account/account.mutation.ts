import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { mutationFetch, mutationFormData } from 'src/config/queryClient'
import { getChangePasswordUrl, getManageOrganizerAccountsUrl, getOrganizerProfileUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { ChangePasswordBody, OrganizerAccount, OrganizerAccountBody, Profile, ProfileBody } from 'src/types/account.type'

export const updateProfile = (
  organizerId: number,
  options?: UseMutationOptions<Profile, ApiError, Partial<ProfileBody>>
) => {
  return useMutation<Profile, ApiError, Partial<ProfileBody>>({
    mutationFn: async (body) => {
      const response = await mutationFormData<Profile>({
        url: getOrganizerProfileUrl(organizerId),
        method: 'PATCH',
        body
      })
      return response
    },
    ...options
  })
}

export const changePassword = (
  organizerId: number,
  options?: UseMutationOptions<undefined, ApiError, ChangePasswordBody>
) => {
  return useMutation<undefined, ApiError, ChangePasswordBody>({
    mutationFn: async (body) => {
      const response = await mutationFetch<undefined>({
        url: getChangePasswordUrl(organizerId),
        method: 'PUT',
        body
      })
      return response
    },
    ...options
  })
}

export const createOrganizerAccount = (
  options?: UseMutationOptions<OrganizerAccount, ApiError, OrganizerAccountBody>
) => {
  return useMutation<OrganizerAccount, ApiError, OrganizerAccountBody>({
    mutationFn: async (body) => {
      const response = await mutationFetch<OrganizerAccount>({
        url: getManageOrganizerAccountsUrl(),
        method: 'POST',
        body
      })
      return response
    },
    ...options
  })
}