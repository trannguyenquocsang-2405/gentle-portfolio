import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: any) {
    return this.prisma.project.create({ data: createProjectDto });
  }

  findAll() {
    return this.prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  update(id: number, updateProjectDto: any) {
    return this.prisma.project.update({ where: { id }, data: updateProjectDto });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
