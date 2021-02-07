import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTicketTable1609697978816 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
`
CREATE TABLE IF NOT EXISTS public.ticket
(
	  id uuid NOT NULL,                        -- ticket id
    ticket_id bigserial NOT NULL,                -- ticket id
    parent_id bigserial,                         -- child ticket
    product character varying(100),              -- root area of product
    area character varying(100),                 -- sub area of product
    title character varying(255) NOT NULL,       -- ticket name or title
    description text,                       
    attachments text[],
    status character varying(100) NOT NULL,      -- New, Active, In-Progress, Done, etc
    reporter uuid NOT NULL,                      -- creator of the ticket
    assigned_to uuid,
    reviewer uuid,
    ticket_type character varying(100) NOT NULL, -- Bug, Feature, Epic, etc
    created_on date NOT NULL,
    modified_on date,
    eta character varying(50),
    priority smallint NOT NULL,                  -- High, Medium, Low, etc
	  sort_order bigserial,
    git json,
    props json,
    PRIMARY KEY (id, ticket_id, sort_order),
    UNIQUE (ticket_id)
);
`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticket')
  }

}
