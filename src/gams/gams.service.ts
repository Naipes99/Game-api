import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateGamDto, GameState } from './dto/create-gam.dto';
import { UpdateGamDto } from './dto/update-gam.dto';
import { Game } from './entities/gam.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GamsService {

  private readonly logger = new Logger('GamsService');

  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
    private readonly userServise: UsersService,
  ){}

  async create(createGamDto: CreateGamDto) {
    const { name, maxPlayers, userId, state } = createGamDto
   try {
    const newGame = await this.gameModel.create({
      name: name,
      maxPlayers: maxPlayers,
      state: state || 'waiting',       
      score: null,
    });

   if (userId){
      const user = await this.userServise.findOne(userId); 
      await newGame.$add('players', user);
    }
    return newGame;

   } catch (error) {
    this.handleDBException(error);
   }
  }

  async findOne(id: number) {
    const game = await this.gameModel.findOne({
      where:{
        id: id,
      },
      include:[
        {
          model: User,
          as: 'players',
          attributes:['id', 'fullname', 'email'],
          through:{
            attributes: [],
          },
        },
      ],
    });
    if(!game){
      throw new BadRequestException(`Game id ${id} not found` );
    }
    return game;
  }

  async joinGame(gameId: number, updateGamDto: UpdateGamDto) {
    const { userId } = updateGamDto;
    if(!userId) 
      throw new BadRequestException('User ID is necesary to join');    
    
    const game = await this.findOne(gameId);

    if (game.dataValues.state !== GameState.WAITING) 
      throw new BadRequestException('Game is not available to join');

    const user = await this.userServise.findOne(userId);

    const alreadyJoined = game.dataValues.players.find((player)=>player.id === userId);
    if(alreadyJoined) 
      throw new BadRequestException('Player already joined the game');

    if(game.dataValues.players.length>=game.dataValues.maxPlayers) 
      throw new BadRequestException('Game is full');

    if(user.dataValues.GameState === GameState.IN_PROGRESS, GameState.WAITING)
      throw new BadRequestException('User is not available to join');

    await game.$add('players', user);

    return {
      message: `User ${user.dataValues.fullname} has joined the game ${game.dataValues.name}`,
    };
  }

  async startGame(id: number, updateGamDto: UpdateGamDto){
    const game = await this.findOne(id);

    try {
      await game.update({
        state: GameState.IN_PROGRESS
      });
      return {
        message: 'Game has been started'
      }
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async endGame(id: number, updateGamDto: UpdateGamDto){
    const game = await this.findOne(id);

    try {
      await game.update({
        state: GameState.FINISHED
      });
      return {
        message: 'Game has finished'
      }
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any){
    if(error.parent.code === '23505'){
      throw new BadRequestException(error.parent.detail);
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Something went very wrong!')
  }

}
