// COMMON
export const ERROR_REQUIRED_FIELD = 'Không được bỏ trống trường này'
export const ERROR_START_TIME_GREATER_THAN_END_TIME = 'Thời gian bắt đầu không được lớn hơn thời gian kết thúc'

// USERNAME
export const ERROR_REQUIRED_USERNAME = 'Tên tài khoản là bắt buộc'
export const MAX_LENGTH_USERNAME = 20
export const MIN_LENGTH_USERNAME = 8
export const ERROR_MAX_LENGTH_USERNAME = `Tên tài khoản chỉ có tối đa ${MAX_LENGTH_USERNAME} ký tự`
export const ERROR_MIN_LENGTH_USERNAME = `Tên tài khoản phải có tối thiểu ${MIN_LENGTH_USERNAME} ký tự`

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
