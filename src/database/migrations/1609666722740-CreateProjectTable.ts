import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateProjectTable1609666722740 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
`CREATE TABLE IF NOT EXISTS public.project
(
    pid uuid NOT NULL,                       -- project id
    gid uuid NOT NULL,                       -- which org the project was created
    status character varying(255) NOT NULL,  -- project status like planning, 
    archive boolean,                         -- is project archive
    avatar character varying(255),           -- project logo
    created_at date NOT NULL,
    description text,
    health character varying(100),
    owner uuid NOT NULL,                     -- owner of the project
    tid uuid[],                              -- which team is working on the project
    PRIMARY KEY(pid)
);
`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('project')
  }

}
