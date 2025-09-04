import dotenv from 'dotenv'

dotenv.config()

const configEnv = DB()
PORT=3005
DB_NAME= HemoApp
DB_USER=root
DB_PASSWORD=""
DB_HOST=localhost
DB_DIALECT=mysql

export default configEnv