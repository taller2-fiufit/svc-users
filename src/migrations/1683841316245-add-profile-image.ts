import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileImage1683841316245 implements MigrationInterface {
    name = 'AddProfileImage1683841316245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profileimage" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileimage"`);
    }

}
