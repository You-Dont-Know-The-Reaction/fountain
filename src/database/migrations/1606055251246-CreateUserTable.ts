import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1606055251246 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE public.users
(
    id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    key character varying(255) NOT NULL,
    super_admin boolean NOT NULL DEFAULT false,
    created_on date NOT NULL,
    PRIMARY KEY (id)
);
`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }

}
