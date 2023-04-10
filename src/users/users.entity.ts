import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullname: string;

  @Column()
  isAdmin: boolean;

  @AfterInsert()
  logInsert() {
    console.log('Insertado Usuario con id:', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Actualizado Usuario con id:', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Eliminado usuario con id:', this.id);
  }
}
