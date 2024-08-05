const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Пути к файлам с данными
const todosFile = 'todos.json';
const usersFile = 'users.json';

// Чтение данных из файлов
let todos = {};
let users = {};
try {
  const todosData = fs.readFileSync(todosFile, 'utf8');
  todos = JSON.parse(todosData);
  const usersData = fs.readFileSync(usersFile, 'utf8');
  users = JSON.parse(usersData);
} catch (err) {
  console.error('Ошибка при чтении данных из файла:', err);
}

// Запись данных в файл
function saveTodos() {
  fs.writeFileSync(todosFile, JSON.stringify(todos), 'utf8');
}

function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(users), 'utf8');
}

// Проверка авторизации
function authenticate(username, password) {
  return users[username] && users[username].password === password;
}

// Генерация токена
function generateToken(username) {
  const token = jwt.sign({ username }, 'your_secret_key');
  users[username].token = token;
  return token;
}

// Проверка токена
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    return decoded.username;
  } catch (error) {
    return null;
  }
}

// Валидация данных
function validateTodo(todo) {
  if (!todo.title || !todo.description) {
    return false;
  }
  return true;
}

function validateRegisterData(data) {
  if (!data.username || !data.password) {
    return false;
  }
  if (data.username.length < 3 || data.password.length < 6) {
    return false;
  }
  return true;
}

function validateLoginData(data) {
  if (!data.username || !data.password) {
    return false;
  }
  return true;
}

// Обработчик запросов
const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Разрешение CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Обработка запроса на предварительную проверку (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Обработка авторизации
  if (pathname === '/login' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        if (!validateLoginData({ username, password })) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Необходимо указать имя пользователя и пароль' }));
          return;
        }
        if (authenticate(username, password)) {
          const token = generateToken(username);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Успешная авторизация', token }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Неправильное имя пользователя или пароль' }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Неверный формат данных' }));
      }
    });
    return;
  }

  // Регистрация нового пользователя
  if (pathname === '/register' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        if (!validateRegisterData({ username, password })) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Имя пользователя должно быть не менее 3 символов, пароль - не менее 6 символов' }));
          return;
        }
        if (users[username]) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Пользователь с таким именем уже существует' }));
        } else {
          users[username] = { password };
          const token = generateToken(username);
          saveUsers();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Пользователь успешно зарегистрирован', token }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Неверный формат данных' }));
      }
    });
    return;
  }

  // Проверка токена
  if (pathname === '/verify' && method === 'POST') {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Требуется авторизация' }));
      return;
    }
    const token = authHeader.split(' ')[1];
    const username = verifyToken(token);
    if (username) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Токен действителен', username }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Неверный токен авторизации' }));
    }
    return;
  }

  // Проверка токена для защищенных ресурсов
  if (pathname.startsWith('/api')) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Требуется авторизация' }));
      return;
    }
    const token = authHeader.split(' ')[1];
    const username = verifyToken(token);
    if (!username) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Неверный токен авторизации' }));
      return;
    }

    // Обработка ресурсов
    if (pathname === '/api/todos' && method === 'GET') {
      const userTodos = Object.values(todos).filter(todo => todo.username === username);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(userTodos));
    } else if (pathname.startsWith('/api/todos/') && method === 'GET') {
      const todoId = pathname.split('/')[2];
      if (todos[todoId] && todos[todoId].username === username) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos[todoId]));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Задача не найдена' }));
      }
    } else if (pathname === '/api/todos' && method === 'POST') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const todo = JSON.parse(body);
          if (!validateTodo(todo)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Необходимо указать заголовок и описание задачи' }));
            return;
          }
          todo.username = username;
          const newTodoId = Date.now().toString();
          todos[newTodoId] = todo;
          saveTodos();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ id: newTodoId }));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Неверный формат данных' }));
        }
      });
    } else if (pathname.startsWith('/api/todos/') && method === 'PUT') {
      const todoId = pathname.split('/')[2];
      if (todos[todoId] && todos[todoId].username === username) {
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', () => {
          try {
            const todo = JSON.parse(body);
            if (!validateTodo(todo)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Необходимо указать заголовок и описание задачи' }));
              return;
            }
            todos[todoId] = todo;
            todos[todoId].username = username;
            saveTodos();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Задача обновлена' }));
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Неверный формат данных' }));
          }
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Задача не найдена' }));
      }
    } else if (pathname.startsWith('/api/todos/') && method === 'DELETE') {
      const todoId = pathname.split('/')[2];
      if (todos[todoId] && todos[todoId].username === username) {
        delete todos[todoId];
        saveTodos();
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Задача не найдена' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Ресурс не найден' }));
    }
  }
};

// Запуск сервера
const server = http.createServer(requestHandler);
server.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});