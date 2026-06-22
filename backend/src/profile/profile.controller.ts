import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: any) {
    return this.profileService.update(+id, updateProfileDto);
  }
}
