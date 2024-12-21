// COMMON
export const ERROR_REQUIRED_FIELD = 'Không được bỏ trống trường này'
export const ERROR_START_TIME_GREATER_THAN_EQUAL_END_TIME = 'Thời gian bắt đầu phải trước thời gian kết thúc'
export const ERROR_END_TIME_LESS_THAN_EQUAL_START_TIME = 'Thời gian kết thúc phải sau thời gian bắt đầu'
export const ERROR_TIME_LESS_THAN_CURRENT_TIME = 'Thời gian không được nhỏ hơn thời gian hiện tại'
// USERNAME
export const ERROR_REQUIRED_USERNAME = 'Tên tài khoản là bắt buộc'
export const MAX_LENGTH_USERNAME = 20
export const MIN_LENGTH_USERNAME = 8
export const ERROR_MAX_LENGTH_USERNAME = `Tên tài khoản chỉ có tối đa ${MAX_LENGTH_USERNAME} ký tự`
export const ERROR_MIN_LENGTH_USERNAME = `Tên tài khoản phải có tối thiểu ${MIN_LENGTH_USERNAME} ký tự`
export const ERROR_INCORRECT_FORMAT_USERNAME = 'Tên tài khoản chỉ chứa ký tự chữ và số'

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

// TIME RANGE
export const REGISTRATION_END_BEFORE_EVENT_START = 'Thời gian kết thúc đăng ký phải trước thời gian bắt đầu sự kiện'
export const EVENT_START_AFTER_REGISTRATION_END = 'Thời gian sự kiện diễn ra phải sau thời gian kết thúc đăng ký'

// PHONE
export const REGEX_PHONE = /(?:\+84|0084|0)[235789][0-9]{1,2}[0-9]{7}(?:[^\d]+|$)/g
export const ERROR_INVALID_PHONE = 'Số điện thoại không hợp lệ'
