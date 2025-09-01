import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateGamDto, GameState } from './dto/create-gam.dto';
import { UpdateGamDto } from './dto/update-gam.dto';
import { Game } from './entities/gam.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class GamsService {

  private readonly logger = new Logger('GamsService');

  constructor(
    @InjectModel(Game)
    private gameModel: typeof Game,
  ){}

  async create(createGamDto: CreateGamDto) {
    const { name, maxPlayers, playerName, state } = createGamDto
   try {
     const newGame = await this.gameModel.create({
      name: name,
      maxPlayers: maxPlayers,
      players: [playerName],
      state: state || 'waiting',
      score: null,
    })
    return newGame;
   } catch (error) {
    this.handleDBException(error);
   }
  }

  async findOne(id: number) {
    const game = await this.gameModel.findOne({
      where:{
        id: id,
      }
    });
    if(!game){
      throw new BadRequestException(`Game id ${id} not found` );
    }
    return game;
  }

  async joinGame(id: number, updateGamDto: UpdateGamDto) {
    const { playerName } = updateGamDto;
    const game = await this.findOne(id);
    
    if(game.dataValues.players.includes(playerName!)){
      throw new BadRequestException('Player has already joined!')
    }
    
    const newPlayers = [...game.dataValues.players, playerName];
  
    if(newPlayers.length > game.dataValues.maxPlayers){
      throw new BadRequestException('game is full!')
    }
    
    try {
      await game.update({
        players: newPlayers,
      })
      return{
        message: 'Player has joined!',
      }
    } catch (error) {
      this.handleDBException(error);
    }
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
