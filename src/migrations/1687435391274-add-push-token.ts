import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPushToken1687435391274 implements MigrationInterface {
  name = 'AddPushToken1687435391274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "pushToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "pushToken"`);
  }
}
