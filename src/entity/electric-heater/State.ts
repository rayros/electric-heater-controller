import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import { ElectricHeater } from "./ElectricHeater";

export enum EState {
    ON = "ON",
    OFF = "OFF"
}

@Entity()
export class State {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => ElectricHeater, electricHeater => electricHeater.states) 
    electricHeater: ElectricHeater; 

    @Column({
        type: "enum",
        enum: EState
    })
    state: EState

    @CreateDateColumn()
    date: Date
}
