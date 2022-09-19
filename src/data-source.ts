import "reflect-metadata"
import { DataSource } from "typeorm"
import { DHT11Stats } from "./entity/DHT11Stats"
import { ElectricHeater } from "./entity/electric-heater/ElectricHeater"
import { RunTime } from "./entity/electric-heater/RunTime"
import { State } from "./entity/electric-heater/State"
import { TemperatureConfig } from "./entity/TemperatureConfig"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [DHT11Stats, ElectricHeater, RunTime, State, TemperatureConfig],
    migrations: [],
    subscribers: [],
})
