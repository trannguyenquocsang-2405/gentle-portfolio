import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) { }

  @Post()
  create(@Body() createResumeDto: any) {
    return this.resumeService.create(createResumeDto);
  }

  @Get()
  findAll() {
    return this.resumeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: any) {
    return this.resumeService.update(+id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(+id);
  }
}
