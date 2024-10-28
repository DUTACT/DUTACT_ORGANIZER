import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login } from 'src/apis/auth'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { setupToken } from 'src/config/queryClient'
import { TIMEOUT } from 'src/constants/common'
import { SUCCESS_MESSAGE } from 'src/constants/message'
import { useAppContext } from 'src/contexts/app.context'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { cn } from 'src/lib/tailwind/utils'
import { path } from 'src/routes/path'
import { AuthBody } from 'src/types/account.type'
import { authenSchema, AuthenSchemaType } from 'src/utils/rules'

type FormData = Pick<AuthenSchemaType, 'username' | 'password'>

const loginSchema = authenSchema.pick(['username', 'password'])

export default function Login() {
  const [_, setAccessToken] = useLocalStorage<string>('access_token', '')
  const { setIsAuthenticated } = useAppContext()

  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const { mutate, error, isPending } = login({
    onSuccess: (data) => {
      setAccessToken(data.accessToken)
      setupToken(data.accessToken)
      setIsAuthenticated(true)
      toast.success(SUCCESS_MESSAGE.LOGIN, {
        autoClose: TIMEOUT.TOAST_SHORT
      })
      navigate(path.home)
    },
    onError: (error) => {
      console.error(error.message)
    }
  })

  const handleLogin = (authData: AuthBody) => {
    mutate(authData)
  }

  const onSubmit = handleSubmit((data: FormData) => {
    handleLogin({
      username: data.username,
      password: data.password
    })
  })

  return (
    <div className='flex w-full min-w-[400px] flex-col'>
      <h1 className='text-4xl font-semibold uppercase tracking-wide text-primary'>Đăng nhập</h1>
      <p className='mt-1 text-sm tracking-wide text-neutral-5'>để quản lý các hoạt động phục vụ cộng đồng</p>
      <div className='mt-4 min-h-[15px] text-sm font-semibold leading-[15px] text-semantic-cancelled'>
        {error?.message}
      </div>
      <form action='' className='mt-4' onSubmit={onSubmit}>
        <Input name='username' control={control} type='text' placeholder='Nhập username' labelName='Username' />
        <Input
          name='password'
          control={control}
          type='password'
          placeholder='Nhập mật khẩu'
          labelName='Mật khẩu của bạn'
        />
        <Button
          title='Đăng nhập'
          type='button'
          classButton='bg-primary/90 hover:bg-primary mt-4'
          classTitle='uppercase font-semibold text-neutral-0 text-md tracking-wide'
          classLoadingIndicator={cn('', {
            block: isPending
          })}
          disabled={isPending}
        />
      </form>
    </div>
  )
}
