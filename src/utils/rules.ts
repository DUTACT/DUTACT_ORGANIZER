import moment from 'moment'
import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'

import * as yup from 'yup'
import { ERROR_MAX_LENGTH_PASSWORD, ERROR_REQUIRED_USERNAME, MAX_LENGTH_USERNAME } from '../../../DUTACT_STUDENT/src/constants/validate'
import { ERROR_INCORRECT_FORMAT_PASSWORD, ERROR_INVALID_PHONE, ERROR_MAX_LENGTH_USERNAME, ERROR_MIN_LENGTH_PASSWORD, ERROR_MIN_LENGTH_USERNAME, ERROR_PASSWORD_NOT_MATCHED, ERROR_REQUIRED_CONFIRM_PASSWORD, ERROR_REQUIRED_FIELD, ERROR_REQUIRED_NAME, ERROR_REQUIRED_PASSWORD, ERROR_START_TIME_GREATER_THAN_END_TIME, EVENT_START_AFTER_REGISTRATION_END, MAX_LENGTH_PASSWORD, MIN_LENGTH_PASSWORD, MIN_LENGTH_USERNAME, REGEX_PASSWORD, REGEX_PHONE, REGISTRATION_END_BEFORE_EVENT_START } from 'src/constants/validate'

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

const validateTimeRange = (
  firstFieldKey: string,
  secondFieldKey: string,
  errorMessage: string | null,
  requiredMessage: string | null,
  minTimeFieldKey?: string,
  maxTimeFieldKey?: string,
  outOfRangeMessage?: string
) => {
  return yup
    .string()
    .required(requiredMessage || '')
    .test({
      name: 'time-range-validation',
      message: errorMessage ?? '',
      test(_, context) {
        const firstValue = context.parent[firstFieldKey]
        const secondValue = context.parent[secondFieldKey]

        if (!firstValue || !secondValue) {
          return context.createError({ message: requiredMessage ?? '' })
        }

        const firstTime = moment(firstValue)
        const secondTime = moment(secondValue)

        if (!firstTime.isValid() || !secondTime.isValid()) {
          return true
        }

        if (minTimeFieldKey) {
          const minValue = context.parent[minTimeFieldKey]
          if (!minValue) return true

          const minTime = moment(minValue)
          if (minTime.isSameOrAfter(firstTime)) {
            return context.createError({ message: outOfRangeMessage ?? '' })
          }
        }

        if (maxTimeFieldKey) {
          const maxValue = context.parent[maxTimeFieldKey]
          if (!maxValue) return true

          const maxTime = moment(maxValue)
          if (maxTime.isSameOrBefore(secondTime)) {
            return context.createError({ message: outOfRangeMessage ?? '' })
          }
        }

        return firstTime.isSameOrBefore(secondTime)
      }
    })
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
  startAt: validateTimeRange(
    'startAt',
    'endAt',
    ERROR_START_TIME_GREATER_THAN_END_TIME,
    ERROR_REQUIRED_FIELD,
    'endRegistrationAt',
    undefined,
    EVENT_START_AFTER_REGISTRATION_END
  ),
  endAt: validateTimeRange(
    'startAt',
    'endAt',
    ERROR_START_TIME_GREATER_THAN_END_TIME,
    ERROR_REQUIRED_FIELD,
    'endRegistrationAt',
    undefined,
    EVENT_START_AFTER_REGISTRATION_END
  ),
  startRegistrationAt: validateTimeRange(
    'startRegistrationAt',
    'endRegistrationAt',
    ERROR_START_TIME_GREATER_THAN_END_TIME,
    ERROR_REQUIRED_FIELD,
    undefined,
    'startAt',
    REGISTRATION_END_BEFORE_EVENT_START
  ),
  endRegistrationAt: validateTimeRange(
    'startRegistrationAt',
    'endRegistrationAt',
    ERROR_START_TIME_GREATER_THAN_END_TIME,
    ERROR_REQUIRED_FIELD,
    undefined,
    'startAt',
    REGISTRATION_END_BEFORE_EVENT_START
  ),
  coverPhoto: yup.mixed<File>().required(ERROR_REQUIRED_FIELD)
})

export const checkInCodeSchema = yup.object({
  title: yup.string().trim().required(ERROR_REQUIRED_FIELD),
  startAt: validateTimeRange('startAt', 'endAt', ERROR_START_TIME_GREATER_THAN_END_TIME, ERROR_REQUIRED_FIELD),
  endAt: validateTimeRange('startAt', 'endAt', ERROR_START_TIME_GREATER_THAN_END_TIME, ERROR_REQUIRED_FIELD)
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

export type AuthenSchemaType = yup.InferType<typeof authenSchema>
export type EventSchemaType = yup.InferType<typeof eventSchema>
export type CheckInCodeSchemaType = yup.InferType<typeof checkInCodeSchema>
export type ProfileSchemaType = yup.InferType<typeof profileSchema>
export type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>
export type RejectParticipationSchemaType = yup.InferType<typeof rejectParticipationSchema>
