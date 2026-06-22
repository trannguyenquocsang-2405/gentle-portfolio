import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  create(createSkillDto: any) {
    return this.prisma.skill.create({ data: createSkillDto });
  }

  findAll() {
    return this.prisma.skill.findMany({ include: { category: true } });
  }

  remove(id: number) {
    return this.prisma.skill.delete({ where: { id } });
  }
}
