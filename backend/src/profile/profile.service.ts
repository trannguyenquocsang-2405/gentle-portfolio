import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    let profile = await this.prisma.profile.findFirst();
    if (!profile) {
      profile = await this.prisma.profile.create({
        data: { name: 'Admin', greeting: 'Hello', about: 'Welcome to my portfolio' }
      });
    }
    return [profile];
  }

  async update(id: number, updateProfileDto: any) {
    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }
}
