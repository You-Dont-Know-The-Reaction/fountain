import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateOrgTable1612713316582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS public.organisation
(
    gid uuid NOT NULL,                    -- org id
	  name character varying(255) NOT NULL, -- org name
	  owner uuid NOT NULL,                  -- user uid
    description text,                     -- about org
    website character varying(255),       -- org homepage
    avatar text,                          -- logo
	  props json,                           -- for extra columns
	  PRIMARY KEY(gid),
	  UNIQUE (gid)
);
`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('organisation')
  }
}
