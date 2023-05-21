import {
  AfterInsert,
  BeforeRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
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
  description: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 5 })
  latitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 5 })
  longitude: number;

  @ManyToMany(() => User, (user) => user.followees, { onDelete: 'CASCADE' })
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  followees: User[];

  @Column({default: 'profile.jpg'})
  profileimage: string;

  @Column({default: false})
  blocked: boolean;

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
