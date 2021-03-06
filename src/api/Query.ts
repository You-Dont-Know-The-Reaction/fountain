export default {
  LIST_USERS: `select id, full_name, email, super_admin from users`,
  CREATE_USER: `insert into users (id, full_name, email, key, super_admin, created_on) values ($1, $2, $3, $4, $5, $6) returning *`,
  CHECK_EMAIL: `select id from users where email=$1`,
  GET_USER_BY_ID: `select * from users where id=$1`,
  GET_USER_BY_EMAIL: `select * from users where email=$1`,
  DELETE_USER_BY_ID: `delete from users where id=$1`
}
