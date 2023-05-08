import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserDescription1683546648415 implements MigrationInterface {
  name = 'AddUserDescription1683546648415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "description" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "description"`);
  }
}
