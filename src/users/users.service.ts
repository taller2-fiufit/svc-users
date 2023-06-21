import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserDto } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMetricDto } from './dtos/create-metric.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  private readonly logger = new Logger(UsersService.name);

  async create(
    email: string,
    password: string,
    fullname: string,
    isAdmin = false,
    description: string,
    city: string,
    country: string,
    latitude: number,
    longitude: number,
    profileimage = 'profile.jpg',
  ) {
    const user = this.repo.create({
      email,
      password,
      fullname,
      description,
      isAdmin,
      city,
      country,
      latitude,
      longitude,
      profileimage,
    });
    this.logger.log(`Usuario Creado: ${email}`);
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      this.logger.warn(`Usuario con id: ${id} no encontrado`);
      throw new NotFoundException();
    }
    this.logger.log(`Usuario Encontrado: ${user.email}`);
    return user;
  }

  find(email: string) {
    this.logger.log(`Usuario Encontrado: ${email}`);
    return this.repo.find({ where: { email } });
  }

  findAll() {
    return this.repo.find({ where: { isAdmin: false } });
  }

  findByDistance(latitude: number, longitude: number, maxDistance: number) {
    const DISTANCE_FORMULA = `ASIN(SQRT(
      POWER(SIN(RADIANS(user.latitude - ${latitude})/2), 2)
      + POWER(SIN(RADIANS(user.longitude - ${longitude})/2), 2)
      * COS(RADIANS(${latitude})) * COS(RADIANS(user.latitude))
      )) * 12756.2`;
    return this.repo
      .createQueryBuilder('user')
      .select('user')
      .addSelect(DISTANCE_FORMULA, 'distance')
      .where('NOT user.isAdmin')
      .andWhere(`${DISTANCE_FORMULA} < :maxDistance`, {
        maxDistance,
      })
      .orderBy('distance', 'ASC', 'NULLS LAST')
      .getMany();
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    this.logger.log(`Usuario Actualizado: ${user.email}`);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    this.logger.log(`Usuario Removido: ${user.email}`);
    return this.repo.remove([user]);
  }

  async followUser(followerId: number, followeeId: number) {
    const follower = await this.repo.findOne({
      where: { id: followerId },
      relations: ['followees'],
    });
    const followee = await this.findOne(followeeId);

    follower.followees.push(followee);
    this.logger.log(`Usuario ${follower.email} sigue a ${followee.email}`);
    await this.repo.save(follower);
    return;
  }

  async unfollowUser(followerId: number, followeeId: number) {
    const follower = await this.repo.findOne({
      where: { id: followerId },
      relations: ['followees'],
    });

    const followee = await this.findOne(followeeId);
    if (!followee) {
      throw new NotFoundException();
    }

    follower.followees = follower.followees.filter((u) => u.id != followeeId);
    this.logger.log(
      `Usuario ${follower.email} deja de seguir a ${followee.email}`,
    );
    await this.repo.save(follower);
  }

  async getFollowers(id: number) {
    const user = await this.repo.findOne({
      where: { id: id },
      relations: ['followers'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user.followers;
  }

  async getFollowees(id: number) {
    const user = await this.repo.findOne({
      where: { id: id },
      relations: ['followees'],
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user.followees;
  }

  async getCount() {
    return (await this.findAll()).length;
  }

  createUserEvent(command: string, userDto: UserDto): CreateMetricDto {
    const metric = new CreateMetricDto();
    metric.service = 'users';
    metric.command = command;
    metric.timestamp = new Date(Date.now());
    metric.attrs = JSON.stringify(userDto);
    this.logger.debug(
      `Se crea evento. COMANDO: ${metric.command} - ATTRS: ${metric.attrs}`,
    );
    return metric;
  }

  userToDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.city = user.city;
    userDto.country = user.country;
    userDto.createdAt = user.createdAt;
    userDto.description = user.description;
    userDto.email = user.email;
    userDto.fullname = user.fullname;
    userDto.id = user.id;
    userDto.isAdmin = user.isAdmin;
    userDto.latitude = user.latitude;
    userDto.longitude = user.longitude;
    userDto.profileimage = user.profileimage;
    return userDto;
  }
}
