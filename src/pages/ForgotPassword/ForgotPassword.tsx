import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { path } from 'src/routes/path'
import { authenSchema, AuthenSchemaType } from 'src/utils/rules'

type FormData = Pick<AuthenSchemaType, 'email'>
const forgotPasswordSchema = authenSchema.pick(['email'])

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })
  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })
  
  return (
    <div className='flex w-full min-w-[400px] flex-col'>
      <h1 className='text-4xl font-semibold uppercase tracking-wide text-primary'>Quên mật khẩu</h1>
      <p className='mt-1 text-sm tracking-wide text-neutral-5'>
        Đừng quá lo lắng vì chúng tôi sẽ giúp bạn lấy lại mật khẩu nhanh chóng
      </p>
      <form action='' className='mt-12' onSubmit={onSubmit}>
        <Input
          name='email'
          register={register}
          type='text'
          placeholder='Nhập email của bạn'
          labelName='Nhập email của bạn để lấy lại mật khẩu'
          errorMessage={errors.email?.message}
        />
        <Button
          title='Lấy lại mật khẩu'
          type='button'
          classButton='bg-primary/90 hover:bg-primary mt-4'
          classTitle='uppercase font-semibold text-neutral-0 text-md tracking-wide'
          classLoadingIndicator='block'
        />
        <div className='mt-4 flex w-full items-center justify-center gap-2'>
          <Link to={path.login} className='text-sm font-medium text-primary/90 hover:text-primary/100'>
            Quay lại trang đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}
