import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateOrgMembersTable1609697560500 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
`CREATE TABLE IF NOT EXISTS public.org_members
(
    gid uuid NOT NULL,                    -- org id
	  uid uuid NOT NULL,                    -- user member
	  owner boolean NOT NULL,               -- is user owner of org
	  is_admin boolean NOT NULL,            -- is user admin of org
	  role character varying(255) NOT NULL, -- role of user
	  props json,
	  PRIMARY KEY(gid),
	  UNIQUE (uid)
);
`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('org_members')
  }

}
