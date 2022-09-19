import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import { ElectricHeater } from "./ElectricHeater"

@Entity()
export class RunTime {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ElectricHeater, electricHeater => electricHeater.runTimes)
  electricHeater: ElectricHeater;

  @Column()
  runTime: number

  @CreateDateColumn()
  date: Date

}
