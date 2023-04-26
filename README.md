# Get Start
## suggest version
```shell
npm -v # 8.19.4
node -v #v16.20.0
```
## config env variables
1. create file '.env' in project root directory
2. create yourself mongodb in https://cloud.mongodb.com/
3. define env variables in '.env' such as

```shell
NODE_ENV='test'
PORT=3001
MONGODB_URI='mongodb+srv://mongodb_user_name:your_password_of_mongodb@cluster0.5mrpqe5.mongodb.net/noteApp?retryWrites=true&w=majority'
TEST_MONGODB_URI='mongodb+srv://mongodb_user_name:MONGODB_URI='mongodb+srv://mongodb_user_name:your_password_of_mongodb@cluster0.5mrpqe5.mongodb.net/noteApp?retryWrites=true&w=majority'
@cluster0.5mrpqe5.mongodb.net/testNoteApp?retryWrites=true&w=majority'
```
3. install & start
```shell
npm install
npm start
```
## build with ui
*if you want run with front-end UI*
replace `"build:ui": "rm -rf build && cd <front-end-project-directory> && npm run build && cp -r build <express-backend-project-directory>"` to your front-end project directory
   