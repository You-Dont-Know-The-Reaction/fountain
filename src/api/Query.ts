export default {
  LIST_USERS: `select * from users`,
  CREATE_USER: `insert into users (id, full_name, email, key, super_admin, created_on) values ($1, $2, $3, $4, $5, $6) returning *`,
  CHECK_EMAIL: `select id from users where email=$1`
}
