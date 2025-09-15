import { Type } from 'class-transformer';
import { AllowNull, BelongsToMany, Column, DataType, Model, Table } from 'sequelize-typescript';
import { Game } from 'src/gams/entities/gam.entity';
import { GamePlayer } from 'src/gams/entities/game-player.entity';

@Table
export class User extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    @Column({
        type: DataType.STRING,
        
    })
    fullname: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    })
    isActive: boolean;

    @BelongsToMany(()=> Game, ()=> GamePlayer)
    games: Game[];

}
