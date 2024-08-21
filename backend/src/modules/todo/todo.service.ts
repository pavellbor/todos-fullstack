import { DatabaseClient } from '../../shared/libs/database-client'
import {
  CreateTodoDto,
  CreateTodoRdo,
  GetAllTodosDto,
  RemoveTodoDto,
  Todo,
  UpdateTodoDto,
  UpdateTodoRdo,
} from './todo.types'

export class TodoService {
  constructor(private readonly databaseClient: DatabaseClient<Todo>) {}

  public getAll(getAllTodosDto: GetAllTodosDto) {
    const todos = this.databaseClient.getAll((todo) => todo.userId === getAllTodosDto.userId)

    return todos
  }

  public create(createTodoDto: CreateTodoDto): CreateTodoRdo {
    const todo = this.databaseClient.add({
      ...createTodoDto,
      completed: false,
    })

    return todo
  }

  public update(updateTodoDto: UpdateTodoDto): UpdateTodoRdo {
    const existsTodo = this.databaseClient.getById(updateTodoDto.id)

    const updatedTodo = {
      ...existsTodo,
      ...updateTodoDto,
    }

    this.databaseClient.updateById(updateTodoDto.id, updatedTodo, {
      replace: true,
    })

    return updatedTodo
  }

  public remove(removeTodoDto: RemoveTodoDto): void {
    this.databaseClient.removeById(removeTodoDto.id)
  }
}
