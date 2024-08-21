import { Button } from '@/shared/ui/button'
import { TextInput } from '@/shared/ui/text-input'
import { useState } from 'react'
import { useSignUp } from '../model/use-sign-up'

export const SignUpForm = () => {
  const [formData, setFormData] = useState<{
    username: string
    password: string
  }>({
    username: '',
    password: '',
  })

  const signIn = useSignUp()

  return (
    <form
      className='auth__form'
      onSubmit={(e) => {
        e.preventDefault()
        signIn(formData)
      }}>
      <TextInput
        value={formData.username}
        placeholder='username'
        isFocused
        onChange={(username) => setFormData({ ...formData, username })}
      />
      <TextInput
        type='password'
        value={formData.password}
        placeholder='password'
        onChange={(password) => setFormData({ ...formData, password })}
      />
      <Button
        text='Sign Up'
        isFilled
      />
    </form>
  )
}
