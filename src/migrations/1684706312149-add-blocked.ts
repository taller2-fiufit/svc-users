import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlocked1684706312149 implements MigrationInterface {
  name = 'AddBlocked1684706312149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "blocked" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "blocked"`);
  }
}
