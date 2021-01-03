import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCommentsTable1609698108924 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
`CREATE TABLE IF NOT EXISTS public.comments
(
	  cid uuid NOT NULL,          -- comment id
    tid uuid NOT NULL,          -- ticket id in which user comment
    replied_to uuid,            -- is it a reply to comment?
    reporter uuid NOT NULL,     -- comment by
    is_edited boolean,          -- is comment edited?
    message text NOT NULL,
    attachments text[],
    created_on date NOT NULL,
    modified_on date,           -- updated when edited
    props json,
    PRIMARY KEY (cid),
    UNIQUE (cid)
);
`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('comments')
  }

}
