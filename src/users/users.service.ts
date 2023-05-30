import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserDto } from './dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMetricDto } from './dtos/create-metric.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

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
    return this.repo.save(user);
  }

  async findOne(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  findAll() {
    return this.repo.find({ where: { isAdmin: false } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.repo.remove([user]);
  }

  async followUser(followerId: number, followeeId: number) {
    const follower = await this.repo.findOne({
      where: { id: followerId },
      relations: ['followees'],
    });
    const followee = await this.findOne(followeeId);

    follower.followees.push(followee);
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

  createUserEvent(command: string, userDto: UserDto): CreateMetricDto {
    const metric = new CreateMetricDto();
    metric.service = 'users';
    metric.command = command;
    metric.timestamp = new Date(Date.now());
    metric.attrs = JSON.stringify(userDto);
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
