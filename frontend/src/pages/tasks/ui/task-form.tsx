import { useAddTask } from '@/features/add-task'
import { Button } from '@/shared/ui/button'
import { TextInput } from '@/shared/ui/text-input'
import { useState } from 'react'

export const TaskForm = () => {
  const addTask = useAddTask()
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState<{ title: string }>({
    title: '',
  })

  return (
    <section className='add-todo'>
      {!isFormVisible && (
        <Button
          className='add-todo__show-form-button'
          icon='bi bi-plus-lg'
          onClick={() => setIsFormVisible(true)}
        />
      )}
      {isFormVisible && (
        <form
          className='add-todo__form'
          onSubmit={(e) => {
            e.preventDefault()
            addTask(formData)
            setFormData({ title: '' })
          }}>
          <Button
            className='close-button'
            type='button'
            icon='bi bi-x'
            onClick={() => setIsFormVisible(false)}
          />
          <TextInput
            placeholder='Task title'
            value={formData.title}
            onChange={(title) => setFormData({ title })}
            isFocused
          />
          <Button
            text='Add'
            isFilled
          />
        </form>
      )}
    </section>
  )
}
