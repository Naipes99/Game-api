import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Game } from "src/gams/entities/gam.entity";
import { User } from "../../users/entities/user.entity";

@Table
export class GamePlayer extends Model{

    @ForeignKey(()=> Game)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    gameId: number;

    @ForeignKey(()=> User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;
}