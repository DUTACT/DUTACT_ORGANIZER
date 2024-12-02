import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import axios from 'axios'
import { queryFetch } from 'src/config/queryClient'
import { getAutoSuggestUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { GeoCodeResponse, GeoItem } from 'src/types/map.type'

const client = axios.create({
  timeout: 45000,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'id'
  }
})

interface GetSuggestedLocationProps {
  query: string
  limit?: number
  options?: UseQueryOptions<GeoItem[], ApiError>
}

export function getSuggestedLocations({ query, limit, options }: GetSuggestedLocationProps) {
  return useQuery<GeoItem[], ApiError>({
    queryKey: ['getSuggestedLocation', query],
    queryFn: async () => {
      if (!query) {
        return []
      }

      const response = await queryFetch<GeoCodeResponse>({
        url: getAutoSuggestUrl(),
        inputParams: {
          q: query,
          apiKey: import.meta.env.VITE_HERE_API_KEY,
          at: '16.07358,108.15013', // Location of Da Nang University of Science and Technology
          lang: 'vi-VN',
          limit: limit || 5
        },
        client
      })
      return response.items
    },
    ...options
  })
}
