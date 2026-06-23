README

## My Picture Gallery

A small MERN app where you log in, upload pictures with a title and some info, and then edit or delete them.

It is for a single user, with images saved to a folder on the backend, and a basic token check for anything that changes data.

What you can do:
-Log in with a username and password
-Upload a picture with a title and an optional bit of info
-Edit the title/info, and change the picture if you want
-Delete a picture, removing the entire file for it
-Click an image to expand it and see the caption

Create a ".env" file in the backend and copy paste the following:

AUTH_USERNAME=/*pick a username - replace this*/
AUTH_PASSWORD=/*pick a password - replace this*/
AUTH_TOKEN=my-mern-project-token

Pick your username and password for authentification purposes.
The above will be used to login once you start the local host

To run it, user needs do run it in the termninal:

cd backend, npm install, npm start
cd frontend, npm install, npm run dev

Look for the local host link the in the frontend terminal and follow the link.

Login information:
Username: the picked username
Password: the picked password

---------------------------------------------------------------

More about the backend, frontend, and API

## backend/ — Express + Mongoose + Multer
server.js — all the routes and setup
models/Item.js — the picture schema (title, info, image filename)
uploads/ — where the actual image files land

## frontend/ — React + Vite
Login.jsx — login/logout form
Upload.jsx — the upload form
Items.jsx — the gallery list, plus the edit/delete handling
ImageBox.jsx — the click-to-expand image with its caption


Images themselves are stored on disk in backend/uploads/ with a generated filename, and only that filename is saved in MongoDB. The backend serves them back at /uploads/<filename>.

## API (CRUD)
Create: POST: /api/auth/login, Log in, returns a token
Read: GET: /api/items, List all pictures, newest first
Create: POST: /api/items Auth Bearer, Upload a picture + title/info
Update: PATCH: /api/items/:id Auth Bearer, Edit info, optionally swap image
Delete: DELETE: /api/items/:id Auth Bearer, Delete a picture

## Youtube (Demo Video)
https://www.youtube.com/watch?v=esnb7jctIlA
