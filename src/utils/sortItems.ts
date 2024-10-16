export type SortDirection = 'asc' | 'desc' | null

export interface SortCriterion<T> {
  field: keyof T
  direction: SortDirection
}

export const sortItems = <T>(items: T[], sortCriteria: SortCriterion<T>[]): T[] => {
  return [...items].sort((a, b) => {
    for (const { field, direction } of sortCriteria) {
      const aValue = a[field]
      const bValue = b[field]

      if (direction === 'asc') {
        if (aValue < bValue) return -1
        if (aValue > bValue) return 1
      } else if (direction === 'desc') {
        if (aValue > bValue) return -1
        if (aValue < bValue) return 1
      }
    }
    return 0
  })
}

export const toggleSortDirection = <T>(sortCriteria: SortCriterion<T>[], field: keyof T): SortCriterion<T>[] => {
  console.log('sortCriteria', sortCriteria, field)
  const newCriteria = [...sortCriteria]
  const index = newCriteria.findIndex((item) => item.field === field)

  if (index !== -1) {
    const currentDirection = newCriteria[index].direction
    newCriteria[index].direction = newCriteria[index].direction =
      currentDirection === null ? 'asc' : currentDirection === 'asc' ? 'desc' : null
  } else {
    newCriteria.push({ field, direction: 'asc' })
  }

  return newCriteria
}

export const getSortDirection = <T>(sortCriteria: SortCriterion<T>[], field: keyof T) => {
  const criterion = sortCriteria.find((item) => item.field === field)
  return criterion ? criterion.direction : null
}
