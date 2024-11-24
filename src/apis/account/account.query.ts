import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { STALE_TIME } from 'src/constants/common'
import { getManageAccountsUrl, getManageStudentAccountsUrl, getOrganizerProfileUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { Account, Profile, StudentAccount, UserRole } from 'src/types/account.type'
import { PageInfo } from 'src/types/pagination.type'

export const getOrganizerProfile = (organizerId: number, options?: UseQueryOptions<Profile, ApiError>) => {
  return useQuery<Profile, ApiError>({
    queryKey: ['getOrganizerProfile', organizerId],
    queryFn: async () => {
      const response = await queryFetch<Profile>({
        url: getOrganizerProfileUrl(organizerId)
      })
      return response
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    ...options
  })
}

interface GetAccountsProps {
  role?: UserRole,
  searchQuery?: string
  page?: number
  pageSize?: number
  options?: UseQueryOptions<PageInfo<Account>, ApiError>
}

export const getAccounts = ({ role, searchQuery, page, pageSize, options }: GetAccountsProps = {}) => {
  return useQuery<PageInfo<Account>, ApiError>({
    queryKey: ['getAccounts', role, searchQuery, page, pageSize],
    queryFn: async () => {
      const response = await queryFetch<PageInfo<Account>>({
        url: getManageAccountsUrl(),
        inputParams: {
          role,
          searchQuery,
          page,
          pageSize
        },
        ...options
      })
      return response
    }
  })
}

interface GetStudentAccountsProps {
  searchQuery?: string
  page?: number
  pageSize?: number
  options?: UseQueryOptions<PageInfo<Account>, ApiError>
}

export const getStudentAccounts = ({ searchQuery, page, pageSize, options }: GetStudentAccountsProps = {}) => {
  return useQuery<PageInfo<StudentAccount>, ApiError>({
    queryKey: ['getStudentAccounts', searchQuery, page, pageSize],
    queryFn: async () => {
      const response = await queryFetch<PageInfo<StudentAccount>>({
        url: getManageStudentAccountsUrl(),
        inputParams: {
          role: 'STUDENT',
          searchQuery,
          page,
          pageSize
        },
        ...options
      })
      return response
    }
  })
}
