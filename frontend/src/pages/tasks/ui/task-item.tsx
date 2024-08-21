import { Task } from '@/entities/task'
import clsx from 'clsx'

export const TaskItem = ({
  task,
  onToggle,
  onRemove,
}: {
  task: Task
  onToggle: () => void
  onRemove: () => void
}) => (
  <li
    className={clsx('todo-item', task.completed && 'todo-item--done')}
    onClick={onToggle}>
    <div className='todo-item__status'>
      <i className='bi bi-check2'></i>
    </div>
    <span className='todo-item__text'>{task.title}</span>
    <button
      className='todo-item__remove-button'
      onClick={(e) => {
        e.stopPropagation()
        onRemove()
      }}>
      <i className='bi bi-trash3'></i>
    </button>
  </li>
)
