import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ColumnNumericTransformer } from "./DHT11Stats"

@Entity()
export class TemperatureConfig {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'decimal',
        transformer: new ColumnNumericTransformer(),
    })
    minTemperature: number

    @Column({
        type: 'decimal',
        transformer: new ColumnNumericTransformer(),
    })
    maxTemperature: number

    @CreateDateColumn()
    date: Date
}
