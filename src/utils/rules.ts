import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import {
  ERROR_INCORRECT_FORMAT_EMAIL,
  ERROR_INCORRECT_FORMAT_PASSWORD,
  ERROR_MAX_LENGTH_PASSWORD,
  ERROR_MIN_LENGTH_PASSWORD,
  ERROR_PASSWORD_NOT_MATCHED,
  ERROR_REQUIRED_CONFIRM_PASSWORD,
  ERROR_REQUIRED_EMAIL,
  ERROR_REQUIRED_NAME,
  ERROR_REQUIRED_PASSWORD,
  MAX_LENGTH_PASSWORD,
  MIN_LENGTH_PASSWORD,
  REGEX_EMAIL,
  REGEX_PASSWORD
} from 'src/constants/validate'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password' | 'name']?: RegisterOptions }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: ERROR_REQUIRED_EMAIL
    },
    pattern: {
      value: REGEX_EMAIL,
      message: ERROR_INCORRECT_FORMAT_EMAIL
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

export const authenSchema = yup.object({
  email: yup.string().required(ERROR_REQUIRED_EMAIL).email(ERROR_INCORRECT_FORMAT_EMAIL),
  password: yup
    .string()
    .required(ERROR_REQUIRED_PASSWORD)
    .min(MIN_LENGTH_PASSWORD, ERROR_MIN_LENGTH_PASSWORD)
    .max(MAX_LENGTH_PASSWORD, ERROR_MAX_LENGTH_PASSWORD)
    .matches(REGEX_PASSWORD, ERROR_INCORRECT_FORMAT_PASSWORD),
  confirm_password: handleConfirmPasswordYup('password'),
  name: yup.string().required(ERROR_REQUIRED_NAME)
})

export type AuthenSchemaType = yup.InferType<typeof authenSchema>
