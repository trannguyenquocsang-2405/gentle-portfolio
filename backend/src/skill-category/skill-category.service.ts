import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillCategoryService {
  constructor(private prisma: PrismaService) {}

  create(createSkillCategoryDto: any) {
    return this.prisma.skillCategory.create({ data: createSkillCategoryDto });
  }

  findAll() {
    return this.prisma.skillCategory.findMany({ include: { skills: true } });
  }

  findOne(id: number) {
    return this.prisma.skillCategory.findUnique({ where: { id } });
  }

  update(id: number, updateSkillCategoryDto: any) {
    return this.prisma.skillCategory.update({
      where: { id },
      data: updateSkillCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.skillCategory.delete({ where: { id } });
  }
}
