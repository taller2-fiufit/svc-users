import {
  AfterInsert,
  BeforeRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @CreateDateColumn()
  createdAt: Date;

  @AfterInsert()
  logInsert() {
    console.log('Insertado Usuario:', this.email);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Actualizado Usuario:', this.email);
  }

  @BeforeRemove()
  logRemove() {
    console.log('Eliminado usuario:', this.email);
  }
}
