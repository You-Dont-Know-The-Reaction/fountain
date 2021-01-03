import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTeamTable1609660378763 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
`
CREATE TABLE IF NOT EXISTS public.team
(
    gid uuid NOT NULL,
    name character varying(255) NOT NULL,
    title character varying(255),
    description character varying(255),
    role character varying(255) NOT NULL,
    uid uuid NOT NULL,
    is_owner boolean,
    props json,
    PRIMARY KEY (gid)
);
`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('team')
  }

}
