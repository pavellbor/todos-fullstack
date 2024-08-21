run: 
	docker container run --env-file ./backend/.env --env-file ./frontend/.env -p 3000:3000 -v /Users/pavelborisov/Documents/Учеба/FSD/todos:/app -v /app/node_modules -v /app/backend/node_modules -v /app/frontend/node_modules --rm --name todos todos:volumes
stop: 
	docker stop todos