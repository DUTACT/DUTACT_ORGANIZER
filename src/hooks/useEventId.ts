import { useParams } from 'react-router-dom'

export function useEventId(): number {
  const { id } = useParams<{ id: string }>()
  return Number(id) ?? 0
}
