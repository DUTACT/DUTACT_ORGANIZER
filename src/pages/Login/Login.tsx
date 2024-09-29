import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { path } from 'src/routes/path'
import { authenSchema, AuthenSchemaType } from 'src/utils/rules'

type FormData = Pick<AuthenSchemaType, 'email' | 'password'>

const loginSchema = authenSchema.pick(['email', 'password'])

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <div className='flex w-full min-w-[400px] flex-col'>
      <h1 className='text-4xl font-semibold uppercase tracking-wide text-primary'>Đăng nhập</h1>
      <p className='mt-1 text-sm tracking-wide text-neutral-5'>để quản lý các hoạt động phục vụ cộng đồng</p>
      <form action='' className='mt-8' onSubmit={onSubmit}>
        <Input
          name='email'
          register={register}
          type='text'
          placeholder='Nhập username'
          labelName='Username'
          errorMessage={errors.email?.message}
        />
        <Input
          name='password'
          register={register}
          type='password'
          placeholder='Nhập mật khẩu của bạn'
          labelName='Mật khẩu của bạn'
          errorMessage={errors.password?.message}
        />
        <div className='mt-2 flex w-full items-center justify-end'>
          <Link to={path.forgotPassword} className='text-sm font-medium text-primary/90 hover:text-primary/100'>
            Quên mật khẩu?
          </Link>
        </div>
        <Button
          title='Đăng nhập'
          type='button'
          classButton='bg-primary/90 hover:bg-primary mt-4'
          classTitle='uppercase font-semibold text-neutral-0 text-md tracking-wide'
          classLoadingIndicator='block'
        />
      </form>
    </div>
  )
}
