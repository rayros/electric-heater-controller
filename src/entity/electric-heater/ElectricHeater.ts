import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RunTime } from "./RunTime";
import { State } from "./State";

@Entity()
export class ElectricHeater {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true
  })
  device_id: string

  @OneToMany(() => RunTime, runTime => runTime.electricHeater)
  runTimes: RunTime[];

  @OneToMany(() => State, state => state.electricHeater)
  states: RunTime[];
}
