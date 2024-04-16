import { FormEventHandler, MouseEventHandler, useState } from 'react'
import './App.css'

type Todo = {
  id: string;
  isDone: boolean;
  content: string
}

const APP_ORIGIN = 'http://localhost:5173'

function NewTaskForm () {
  const [content, setContent] = useState('')

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const newTask: Todo = {
      id: Date.now().toString(),
      isDone: false,
      content,
    };

    window.postMessage(JSON.stringify(newTask), { targetOrigin: APP_ORIGIN });
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <textarea
        required
        cols={30}
        rows={10}
        onChange={e => setContent(e.target.value)}
        value={content}
      />
      <button>Create</button>
    </form>
  )
}

function App () {
  const [todos, setTodos] = useState<Todo[]>([])

  if (window.location.hash === '#/tasks/new') {
    return <NewTaskForm />
  }

  const handleCreateTask: MouseEventHandler = (e) => {
    e.preventDefault();

    const newTaskTab = window.open('/#/tasks/new', '_blank')

    newTaskTab?.addEventListener('message', (event) => {
      console.info(event.origin);
      if (event.origin !== APP_ORIGIN) return;

      const newTask = JSON.parse(event.data) as Todo;

      setTodos([...todos, newTask]);

      newTaskTab.close();
    })
  };

  return (
    <>
      <main className="App">
        <button onClick={handleCreateTask}>
          Create new task
        </button>
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={() => {
                  setTodos(todos.map(it => {
                    if (it.id === todo.id) {
                      return { ...it, isDone: !it.isDone }
                    }

                    return it
                  }))
                }}
              />
              <span>{todo.content}</span>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export default App
