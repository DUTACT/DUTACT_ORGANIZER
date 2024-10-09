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
  ERROR_START_TIME_GREATER_THAN_END_TIME
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

const validateTimeRange = (
  firstFieldKey: string,
  secondFieldKey: string,
  errorMessage: string | null,
  requiredMessage: string | null,
  minTimeFieldKey?: string,
  maxTimeFieldKey?: string,
  outOfRangeMessage?: string
) => {
  return yup.string().test({
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
        return false
      }

      if (minTimeFieldKey) {
        const minTime = moment(context.parent[minTimeFieldKey])
        if (minTime.isSameOrAfter(firstTime)) {
          return context.createError({ message: outOfRangeMessage ?? '' })
        }
      }

      if (maxTimeFieldKey) {
        const maxTime = moment(context.parent[maxTimeFieldKey])
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
    'Thời gian sự kiện diễn ra phải sau thời gian kết thúc đăng ký'
  ),
  endAt: validateTimeRange(
    'startAt',
    'endAt',
    ERROR_START_TIME_GREATER_THAN_END_TIME,
    ERROR_REQUIRED_FIELD,
    'endRegistrationAt',
    undefined,
    'Thời gian sự kiện diễn ra phải sau thời gian kết thúc đăng ký'
  ),
  startRegistrationAt: validateTimeRange(
    'startRegistrationAt',
    'endRegistrationAt',
    ERROR_START_TIME_GREATER_THAN_END_TIME,
    ERROR_REQUIRED_FIELD,
    undefined,
    'startAt',
    'Thời gian kết thúc đăng ký phải trước thời gian bắt đầu sự kiện'
  ),
  endRegistrationAt: validateTimeRange(
    'startRegistrationAt',
    'endRegistrationAt',
    ERROR_START_TIME_GREATER_THAN_END_TIME,
    ERROR_REQUIRED_FIELD,
    undefined,
    'startAt',
    'Thời gian kết thúc đăng ký phải trước thời gian bắt đầu sự kiện'
  )
})

export type AuthenSchemaType = yup.InferType<typeof authenSchema>
export type EventSchemaType = yup.InferType<typeof eventSchema>
