import { Module } from '@nestjs/common';
import { GamsService } from './gams.service';
import { GamsController } from './gams.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from './entities/gam.entity';

@Module({
  controllers: [GamsController],
  providers: [GamsService],
  imports: [SequelizeModule.forFeature([Game])]
})
export class GamsModule {}
