import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillCategoryService } from './skill-category.service';
import { CreateSkillCategoryDto } from './dto/create-skill-category.dto';
import { UpdateSkillCategoryDto } from './dto/update-skill-category.dto';

@Controller('skill-category')
export class SkillCategoryController {
  constructor(private readonly skillCategoryService: SkillCategoryService) {}

  @Post()
  create(@Body() createSkillCategoryDto: CreateSkillCategoryDto) {
    return this.skillCategoryService.create(createSkillCategoryDto);
  }

  @Get()
  findAll() {
    return this.skillCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillCategoryDto: UpdateSkillCategoryDto) {
    return this.skillCategoryService.update(+id, updateSkillCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillCategoryService.remove(+id);
  }
}
