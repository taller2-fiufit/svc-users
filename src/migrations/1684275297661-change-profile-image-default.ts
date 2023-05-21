import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeProfileImageDefault1684275297661
  implements MigrationInterface
{
  name = 'ChangeProfileImageDefault1684275297661';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "profileimage" SET DEFAULT 'profile.jpg'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "profileimage" DROP DEFAULT`,
    );
  }
}
