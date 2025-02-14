import moment from 'moment'
import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import {
  ERROR_REQUIRED_USERNAME,
  MAX_LENGTH_USERNAME,
  MIN_LENGTH_USERNAME,
  ERROR_MAX_LENGTH_USERNAME,
  ERROR_MIN_LENGTH_USERNAME,
  ERROR_INCORRECT_FORMAT_PASSWORD,
  ERROR_MAX_LENGTH_PASSWORD,
  ERROR_MIN_LENGTH_PASSWORD,
  ERROR_PASSWORD_NOT_MATCHED,
  ERROR_REQUIRED_CONFIRM_PASSWORD,
  ERROR_REQUIRED_PASSWORD,
  MAX_LENGTH_PASSWORD,
  MIN_LENGTH_PASSWORD,
  REGEX_PASSWORD,
  ERROR_REQUIRED_NAME,
  ERROR_REQUIRED_FIELD,
  ERROR_START_TIME_GREATER_THAN_EQUAL_END_TIME,
  EVENT_START_AFTER_REGISTRATION_END,
  REGISTRATION_END_BEFORE_EVENT_START,
  REGEX_PHONE,
  ERROR_INVALID_PHONE,
  ERROR_INCORRECT_FORMAT_USERNAME,
  ERROR_TIME_LESS_THAN_CURRENT_TIME,
  ERROR_END_TIME_LESS_THAN_EQUAL_START_TIME
} from 'src/constants/validate'
import * as yup from 'yup'

type Rules = { [key in 'username' | 'password' | 'confirm_password' | 'name']?: RegisterOptions }

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  username: {
    required: {
      value: true,
      message: ERROR_REQUIRED_USERNAME
    },
    maxLength: {
      value: MAX_LENGTH_USERNAME,
      message: ERROR_MAX_LENGTH_USERNAME
    },
    minLength: {
      value: MIN_LENGTH_USERNAME,
      message: ERROR_MIN_LENGTH_USERNAME
    }
  },
  password: {
    required: {
      value: true,
      message: ERROR_REQUIRED_PASSWORD
    },
    maxLength: {
      value: MAX_LENGTH_PASSWORD,
      message: ERROR_MAX_LENGTH_PASSWORD
    },
    minLength: {
      value: MIN_LENGTH_PASSWORD,
      message: ERROR_MIN_LENGTH_PASSWORD
    },
    pattern: {
      value: REGEX_PASSWORD,
      message: ERROR_INCORRECT_FORMAT_PASSWORD
    }
  },
  confirm_password: {
    required: {
      value: true,
      message: ERROR_REQUIRED_CONFIRM_PASSWORD
    },
    maxLength: {
      value: MAX_LENGTH_PASSWORD,
      message: ERROR_MAX_LENGTH_PASSWORD
    },
    minLength: {
      value: MIN_LENGTH_PASSWORD,
      message: ERROR_MIN_LENGTH_PASSWORD
    },
    validate:
      typeof getValues === 'function'
        ? (value) => value === getValues('password') || ERROR_PASSWORD_NOT_MATCHED
        : undefined
  },
  name: {
    required: {
      value: true,
      message: ERROR_REQUIRED_NAME
    }
  }
})

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required(ERROR_REQUIRED_CONFIRM_PASSWORD)
    .min(MIN_LENGTH_PASSWORD, ERROR_MIN_LENGTH_PASSWORD)
    .max(MAX_LENGTH_PASSWORD, ERROR_MAX_LENGTH_PASSWORD)
    .oneOf([yup.ref(refString)], ERROR_PASSWORD_NOT_MATCHED)
}

const timeRangeCompareTest = (
  compareFieldKey: string,
  type: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'ne',
  errorMessage: string | null
): yup.TestConfig<string | undefined, yup.AnyObject> => {
  return {
    name: 'time-range-compare-validation',
    message: errorMessage ?? '',
    test(value, context) {
      const firstValue = value
      const secondValue = context.parent[compareFieldKey]

      if (!firstValue) {
        return true
      }

      if (!secondValue) {
        return true
      }

      const firstTime = moment(firstValue)
      const secondTime = moment(secondValue)

      if (!firstTime.isValid() || !secondTime.isValid()) {
        return true
      }

      switch (type) {
        case 'gt':
          return firstTime.isAfter(secondTime)
        case 'lt':
          return firstTime.isBefore(secondTime)
        case 'gte':
          return firstTime.isSameOrAfter(secondTime)
        case 'lte':
          return firstTime.isSameOrBefore(secondTime)
        case 'eq':
          return firstTime.isSame(secondTime)
        case 'ne':
          return !firstTime.isSame(secondTime)
        default:
          return true
      }
    }
  }
}

const timeAfterNowTest: yup.TestConfig<string | undefined, yup.AnyObject> = {
  name: 'time-after-now-validation',
  message: ERROR_TIME_LESS_THAN_CURRENT_TIME,
  test: (value) => {
    if (!value) return true

    const time = moment(value)
    return time.isAfter(moment())
  }
}

export const authenSchema = yup.object({
  username: yup
    .string()
    .required(ERROR_REQUIRED_USERNAME)
    .min(MIN_LENGTH_USERNAME, ERROR_MIN_LENGTH_USERNAME)
    .max(MAX_LENGTH_USERNAME, ERROR_MAX_LENGTH_USERNAME),
  password: yup
    .string()
    .required(ERROR_REQUIRED_PASSWORD)
    .min(MIN_LENGTH_PASSWORD, ERROR_MIN_LENGTH_PASSWORD)
    .max(MAX_LENGTH_PASSWORD, ERROR_MAX_LENGTH_PASSWORD)
    .matches(REGEX_PASSWORD, ERROR_INCORRECT_FORMAT_PASSWORD),
  confirm_password: handleConfirmPasswordYup('password'),
  name: yup.string().required(ERROR_REQUIRED_NAME)
})

export const eventSchema = yup.object({
  name: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  content: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  startAt: yup
    .string()
    .test(timeRangeCompareTest('endAt', 'lt', ERROR_START_TIME_GREATER_THAN_EQUAL_END_TIME))
    .test(timeRangeCompareTest('endRegistrationAt', 'gt', EVENT_START_AFTER_REGISTRATION_END))
    .required(ERROR_REQUIRED_FIELD),
  endAt: yup
    .string()
    .test(timeRangeCompareTest('startAt', 'gt', ERROR_END_TIME_LESS_THAN_EQUAL_START_TIME))
    .test(timeAfterNowTest)
    .required(ERROR_REQUIRED_FIELD),
  startRegistrationAt: yup
    .string()
    .test(timeRangeCompareTest('endRegistrationAt', 'lt', ERROR_START_TIME_GREATER_THAN_EQUAL_END_TIME))
    .required(ERROR_REQUIRED_FIELD),
  endRegistrationAt: yup
    .string()
    .test(timeRangeCompareTest('startRegistrationAt', 'gt', ERROR_END_TIME_LESS_THAN_EQUAL_START_TIME))
    .test(timeRangeCompareTest('startAt', 'lt', REGISTRATION_END_BEFORE_EVENT_START))
    .test(timeAfterNowTest)
    .required(ERROR_REQUIRED_FIELD),
  coverPhoto: yup.mixed<File>().required(ERROR_REQUIRED_FIELD)
})

export const checkInCodeSchema = yup.object({
  title: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  startAt: yup
    .string()
    .required(ERROR_REQUIRED_FIELD)
    .test(timeRangeCompareTest('endAt', 'lt', ERROR_START_TIME_GREATER_THAN_EQUAL_END_TIME)),
  endAt: yup
    .string()
    .required(ERROR_REQUIRED_FIELD)
    .test(timeRangeCompareTest('startAt', 'gt', ERROR_END_TIME_LESS_THAN_EQUAL_START_TIME))
    .test(timeAfterNowTest)
})

export const profileSchema = yup.object({
  name: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  address: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  phone: yup.string().trim().required(ERROR_REQUIRED_FIELD).matches(REGEX_PHONE, ERROR_INVALID_PHONE),
  personInChargeName: yup.string().trim().required(ERROR_REQUIRED_FIELD)
})

export const changePasswordSchema = yup.object({
  oldPassword: yup.string().trim().required(ERROR_REQUIRED_PASSWORD),
  newPassword: yup
    .string()
    .trim()
    .required(ERROR_REQUIRED_PASSWORD)
    .min(MIN_LENGTH_PASSWORD, ERROR_MIN_LENGTH_PASSWORD)
    .max(MAX_LENGTH_PASSWORD, ERROR_MAX_LENGTH_PASSWORD)
    .matches(REGEX_PASSWORD, ERROR_INCORRECT_FORMAT_PASSWORD),
  confirmPassword: handleConfirmPasswordYup('newPassword')
})

export const rejectParticipationSchema = yup.object({
  reason: yup.string().trim().required(ERROR_REQUIRED_FIELD)
})

export const createOrganizerAccountSchema = yup.object({
  username: yup
    .string()
    .required(ERROR_REQUIRED_USERNAME)
    .min(MIN_LENGTH_USERNAME, ERROR_MIN_LENGTH_USERNAME)
    .max(MAX_LENGTH_USERNAME, ERROR_MAX_LENGTH_USERNAME)
    .matches(/^[a-zA-Z0-9]+$/, ERROR_INCORRECT_FORMAT_USERNAME),
  password: yup
    .string()
    .required(ERROR_REQUIRED_PASSWORD)
    .min(MIN_LENGTH_PASSWORD, ERROR_MIN_LENGTH_PASSWORD)
    .max(MAX_LENGTH_PASSWORD, ERROR_MAX_LENGTH_PASSWORD)
    .matches(REGEX_PASSWORD, ERROR_INCORRECT_FORMAT_PASSWORD),
  confirmPassword: handleConfirmPasswordYup('password'),
  name: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  phone: yup.string().trim().required(ERROR_REQUIRED_FIELD).matches(REGEX_PHONE, ERROR_INVALID_PHONE),
  address: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  personInChargeName: yup.string().trim().required(ERROR_REQUIRED_FIELD)
})

export type AuthenSchemaType = yup.InferType<typeof authenSchema>
export type EventSchemaType = yup.InferType<typeof eventSchema>
export type CheckInCodeSchemaType = yup.InferType<typeof checkInCodeSchema>
export type ProfileSchemaType = yup.InferType<typeof profileSchema>
export type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>
export type RejectParticipationSchemaType = yup.InferType<typeof rejectParticipationSchema>
export type CreateOrganizerAccountSchemaType = yup.InferType<typeof createOrganizerAccountSchema>
