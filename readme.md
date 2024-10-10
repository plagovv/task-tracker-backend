# Task Tracker Backend API

Это API для приложения для отслеживания задач (Task Tracker). Оно позволяет пользователям создавать, редактировать и
управлять задачами, а также управлять статусами задач.

## Структура проекта

- **models/** - содержит схемы MongoDB для пользователей, задач и статусов.
- **routes/** - содержит маршруты для аутентификации, управления задачами и статусами.
- **middleware/** - содержит промежуточные программы, такие как аутентификация.
- **app.js** - основной файл приложения.

## Установка и запуск приложения для разработки

### Предварительные требования

- Установленный [Node.js](https://nodejs.org/)
- Установленный [MongoDB](https://www.mongodb.com/)
- Нагрузочный менеджер [npm](https://www.npmjs.com/) (идет в комплекте с Node.js)

### Шаги для запуска в режиме разработки

1. Клонируйте репозиторий:

```bash 
git clone git@gitlab.com:plagov-task-tracker/task-tracker-backend.git && cd task-tracker-backend
```

2. Установите зависимости:

```bash
 npm install
```

3. Создайте файл `.env` в корне проекта и добавьте свои переменные окружения:

```dotenv
MONGO_URI=mongodb://localhost:27017/task-tracker
JWT_SECRET=ваш_секретный_ключ
```

4. Запустите приложение:

```bash
npm run dev
```

Если вы используете `nodemon`, то приложение будет автоматически перезагружаться при изменениях.

## Развертывание в Docker

### Предварительные требования

- Установленный [Docker](https://www.docker.com/)
- Установленный [Docker Compose](https://docs.docker.com/compose/)

### Шаги для развертывания в Docker

1. Создайте файл `.env` в корне проекта и добавьте переменные окружения для Docker (если еще не созданы):

```dotenv
MONGO_URI=mongodb://mongo:27017/task-tracker
JWT_SECRET=ваш_секретный_ключ
```

2. Запустите приложение с помощью Docker Compose:

```bash
docker-compose up --build
```

3. Приложение будет доступно на порту `3005`.

## Использование маршрутов

### Аутентификация

- **Регистрация пользователя**

```http request
POST /api/auth/register Content-Type: application/json

{ "username": "user1", "password": "password123" }
```

- **Аутентификация пользователя**

```http request
POST /api/auth/login Content-Type: application/json

{ "username": "user1", "password": "password123" }
```

**Ответ:**
```json
 { "token": "<jwt_token>" }
```

### Статусы

- **Получение всех статусов**

```http request
GET /api/statuses
```

- **Создание статуса**

```http request
POST /api/statuses Content-Type: application/json

{ "name": "К выполнению" }
```

### Задачи

- **Создание задачи**

```http request
POST /api/tasks Authorization: Bearer <jwt_token> Content-Type: application/json

{ "title": "Задача 1", "description": "Описание задачи", "status": "<status_id>", // ID статуса "priority": 2 }
```

- **Получение всех задач для текущего пользователя**

```http request
GET /api/tasks Authorization: Bearer <jwt_token>
```

- **Обновление задачи**

```http request
PUT /api/tasks/<task_id> Authorization: Bearer <jwt_token> Content-Type: application/json

{ "title": "Задача 1 обновлена", "description": "Новое описание", "status": "<new_status_id>", // новый ID статуса "
priority": 2 }
```

- **Удаление задачи**

```http request
DELETE /api/tasks/<task_id> Authorization: Bearer <jwt_token>
```

## Заключение

Если у вас есть вопросы или предложения по улучшению, пожалуйста, свяжитесь!

---