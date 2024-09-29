// EMAIL
export const REGEX_EMAIL =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
export const ERROR_REQUIRED_EMAIL = 'Email là bắt buộc'
export const ERROR_INCORRECT_FORMAT_EMAIL = 'Email không đúng định dạng'

// PASSWORD
export const MAX_LENGTH_PASSWORD = 128
export const MIN_LENGTH_PASSWORD = 8
export const REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const ERROR_REQUIRED_PASSWORD = 'Mật khẩu là bắt buộc'
export const ERROR_MAX_LENGTH_PASSWORD = `Mật khẩu chỉ có tối đa ${MAX_LENGTH_PASSWORD} ký tự`
export const ERROR_MIN_LENGTH_PASSWORD = `Mật khẩu phải có tối thiểu ${MIN_LENGTH_PASSWORD} ký tự`
export const ERROR_INCORRECT_FORMAT_PASSWORD =
  'Mật khẩu phải có ít nhất một ký tự chữ, một ký tự số và một ký tự đặc biệt'
  
// CONFIRM_PASSWORD
export const ERROR_REQUIRED_CONFIRM_PASSWORD = 'Nhập lại mật khẩu là bắt buộc'
export const ERROR_PASSWORD_NOT_MATCHED = 'Nhập lại mật khẩu không khớp'
// NAME
export const ERROR_REQUIRED_NAME = 'Tên là bắt buộc'
