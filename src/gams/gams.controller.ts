import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GamsService } from './gams.service';
import { CreateGamDto } from './dto/create-gam.dto';
import { UpdateGamDto } from './dto/update-gam.dto';

@Controller('gams')
export class GamsController {
  constructor(private readonly gamsService: GamsService) {}

  @Post()
  create(@Body() createGamDto: CreateGamDto) {
    return this.gamsService.create(createGamDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gamsService.findOne(+id);
  }

  @Patch(':id/join')
  joinGame(@Param('id') id: string, @Body() updateGamDto: UpdateGamDto) {
    return this.gamsService.joinGame(+id, updateGamDto);
  }

  @Patch(':id/start')
  startGame(@Param('id') id: string, @Body() updateGamDto: UpdateGamDto) {
    return this.gamsService.startGame(+id, updateGamDto)
  }

   @Patch(':id/end')
  endGame(@Param('id') id: string, @Body() updateGamDto: UpdateGamDto) {
    return this.gamsService.endGame(+id, updateGamDto)
  }

}
