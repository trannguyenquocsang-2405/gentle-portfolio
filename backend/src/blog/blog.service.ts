import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  create(createBlogDto: any) {
    return this.prisma.blogPost.create({
      data: createBlogDto,
    });
  }

  findAll() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.blogPost.findUnique({
      where: { id },
    });
  }

  update(id: number, updateBlogDto: any) {
    return this.prisma.blogPost.update({
      where: { id },
      data: updateBlogDto,
    });
  }

  remove(id: number) {
    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
