import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialLinkService.remove(+id);
  }
}
