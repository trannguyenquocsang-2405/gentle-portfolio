import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceService {
  constructor(private prisma: PrismaService) {}

  create(createExperienceDto: any) {
    return this.prisma.experience.create({ data: createExperienceDto });
  }

  findAll() {
    return this.prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.experience.findUnique({ where: { id } });
  }

  update(id: number, updateExperienceDto: any) {
    return this.prisma.experience.update({ where: { id }, data: updateExperienceDto });
  }

  remove(id: number) {
    return this.prisma.experience.delete({ where: { id } });
  }
}
