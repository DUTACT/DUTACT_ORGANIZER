export type SortDirection = 'asc' | 'desc' | null

export interface SortCriterion<T> {
  field: keyof T
  direction: SortDirection
}

export const sortItems = <T>(
  items: T[],
  sortCriteria: SortCriterion<T>[],
  compareFns?: Partial<Record<keyof T, (a: T, b: T) => number>>
): T[] => {
  return [...items].sort((a, b) => {
    for (const { field, direction } of sortCriteria) {
      if (direction === null) continue

      const compareFn =
        compareFns?.[field] ||
        ((a, b) => {
          const aValue = a[field]
          const bValue = b[field]

          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
        })

      const result = compareFn(a, b)
      return direction === 'asc' ? result : -result
    }
    return 0
  })
}

export const toggleSortDirection = <T>(sortCriteria: SortCriterion<T>[], field: keyof T): SortCriterion<T>[] => {
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
