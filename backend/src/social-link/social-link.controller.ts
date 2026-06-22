import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { SocialLinkService } from './social-link.service';

@Controller('social-link')
export class SocialLinkController {
  constructor(private readonly socialLinkService: SocialLinkService) {}

  @Post()
  create(@Body() createSocialLinkDto: any) {
    return this.socialLinkService.create(createSocialLinkDto);
  }

  @Get()
  findAll() {
    return this.socialLinkService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocialLinkDto: any) {
    return this.socialLinkService.update(+id, updateSocialLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialLinkService.remove(+id);
  }
}
