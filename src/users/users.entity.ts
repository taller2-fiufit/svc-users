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

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 5 })
  latitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 5 })
  longitude: number;

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
