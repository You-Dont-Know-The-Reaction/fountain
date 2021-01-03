import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTicketActivityLogTable1609698215580 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
`CREATE TABLE IF NOT EXISTS public.ticket_activity_log
(
	  id uuid NOT NULL,
	  tid uuid NOT NULL,                            -- ticket id for its activity
	  action_type character varying(200) NOT NULL,  -- what kind of action it was?
	  action_by uuid NOT NULL,                      -- action perform by user
	  to character varying(255),                    -- new value
	  from character varying(255),                  -- old value
	  description text,                             -- a brief description
	  created_at timestamp with time zone 
);
`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticket_activity_log')
  }

}
