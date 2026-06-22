import { Module } from '@nestjs/common';
import { SkillCategoryService } from './skill-category.service';
import { SkillCategoryController } from './skill-category.controller';

import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SkillCategoryController],
  providers: [SkillCategoryService, PrismaService],
})
export class SkillCategoryModule {}
