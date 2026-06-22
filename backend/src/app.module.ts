import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { SkillModule } from './skill/skill.module';
import { ProjectModule } from './project/project.module';
import { BlogModule } from './blog/blog.module';
import { SocialLinkModule } from './social-link/social-link.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SkillCategoryModule } from './skill-category/skill-category.module';

@Module({
  imports: [PrismaModule, ProfileModule, SkillModule, ProjectModule, BlogModule, SocialLinkModule, AuthModule, CloudinaryModule, SkillCategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
