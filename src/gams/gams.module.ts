import { Module } from '@nestjs/common';
import { GamsService } from './gams.service';
import { GamsController } from './gams.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Game } from './entities/gam.entity';
import { GamePlayer } from './entities/game-player.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [GamsController],
  providers: [GamsService],
  imports: [SequelizeModule.forFeature([Game, GamePlayer]), UsersModule]
})
export class GamsModule {}
