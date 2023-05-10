import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGeoInfo1683511599225 implements MigrationInterface {
  name = 'AddGeoInfo1683511599225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "country" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "latitude" numeric(10,5)`);
    await queryRunner.query(`ALTER TABLE "user" ADD "longitude" numeric(10,5)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "longitude"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "latitude"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
  }
}
