import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPassRecoveryToken1687439169613 implements MigrationInterface {
  name = 'AddPassRecoveryToken1687439169613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "passRecoveryToken" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "passRecoveryToken"`,
    );
  }
}
