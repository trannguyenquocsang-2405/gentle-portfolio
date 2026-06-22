import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SocialLinkService } from './social-link.service';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';

@Controller('social-link')
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Post()
  create(@Body() createSocialLinkDto: CreateSocialLinkDto) {
    return this.socialLinkService.create(createSocialLinkDto);
  }

  @Get()
  findAll() {
    return this.socialLinkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialLinkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocialLinkDto: UpdateSocialLinkDto) {
    return this.socialLinkService.update(+id, updateSocialLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialLinkService.remove(+id);
  }
}
