FROM node

WORKDIR /app

COPY package.json .

COPY backend/package.json ./backend/package.json

COPY frontend/package.json ./frontend/package.json

RUN npm install 

COPY . .

ENV PORT=3000 \
    TOKEN_SECRET_KEY=salt \
    DB_USERS_PATH=database/users.json \
    DB_TODOS_PATH=database/todos.json \
    PUBLIC_DIR_PATH=../frontend/dist \
    ROOT_HTML_PATH=../frontend/dist/index.html

EXPOSE ${PORT}

CMD [ "npm", "start" ]