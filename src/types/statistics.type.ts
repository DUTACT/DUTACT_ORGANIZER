export interface OverallStatistics {
  totalEvents: number
  totalFollows: number
  totalPostLikes: number
  totalFeedbacks: number
  totalFeedbackLikes: number
}

export interface QuantityStatByDate {
  date: string
  count: number
}

export interface StudentParticipationStat {
  registrations: QuantityStatByDate[]
  participations: QuantityStatByDate[]
}

export interface RegistrationAndParticipationQuantityByDate {
  date: string
  registrations: number
  participations: number
}

export interface RegistrationAndParticipationQuantityByWeek {
  week: string
  registrations: number
  participations: number
}

export interface RegistrationAndParticipationQuantityByMonth {
  month: string
  registrations: number
  participations: number
}

export interface DateStatProps {
  filterType: string
  fromDate?: string
  toDate?: string
  startYear?: number
  endYear?: number
  startWeek?: string
  endWeek?: string
  startMonth?: number
  endMonth?: number
}
