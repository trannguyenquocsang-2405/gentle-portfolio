import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialLinkService {
  constructor(private prisma: PrismaService) {}

  create(createSocialLinkDto: any) {
    return this.prisma.socialLink.create({ data: createSocialLinkDto });
  }

  findAll() {
    return this.prisma.socialLink.findMany();
  }

  update(id: number, updateSocialLinkDto: any) {
    return this.prisma.socialLink.update({
      where: { id },
      data: updateSocialLinkDto,
    });
  }

  remove(id: number) {
    return this.prisma.socialLink.delete({ where: { id } });
  }
}
