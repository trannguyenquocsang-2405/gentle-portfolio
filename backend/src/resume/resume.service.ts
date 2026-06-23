import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResumeService {
  constructor(private prisma: PrismaService) { }

  create(createResumeDto: any) {
    return this.prisma.resume.create({ data: createResumeDto });
  }

  findAll() {
    return this.prisma.resume.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.resume.findUnique({ where: { id } });
  }

  update(id: number, updateResumeDto: any) {
    return this.prisma.resume.update({ where: { id }, data: updateResumeDto });
  }

  remove(id: number) {
    return this.prisma.resume.delete({ where: { id } });
  }
}
