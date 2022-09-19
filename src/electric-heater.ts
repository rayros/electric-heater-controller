import { AsyncMqttClient } from "async-mqtt";
import { AppDataSource } from "./data-source";
import { DHT11Stats } from "./entity/DHT11Stats";
import { ElectricHeater } from "./entity/electric-heater/ElectricHeater";
import { RunTime } from "./entity/electric-heater/RunTime";
import { EState, State } from "./entity/electric-heater/State";
import { TemperatureConfig } from "./entity/TemperatureConfig";


export const onElectricHeater = async (client: AsyncMqttClient) => {
  console.log('Electric heater publish ON');
  await client.publish(process.env.MQTT_ELECTRIC_HEATER_PUBLISH, 'ON');
}

export const offElectricHeater = async (client: AsyncMqttClient) => {
  console.log('Electric heater publish OFF')
  await client.publish(process.env.MQTT_ELECTRIC_HEATER_PUBLISH, 'OFF');
}

export const saveStateAndRunTime = async (stateValue: EState) => {
  await AppDataSource.getRepository(ElectricHeater).upsert({
    device_id: process.env.MQTT_ELECTRIC_HEATER_ID
  }, {
    conflictPaths: ['device_id'],
    skipUpdateIfNoValuesChanged: true
  });
  const electricHeater = await AppDataSource.getRepository(ElectricHeater).findOne({
    where: {
      device_id: process.env.MQTT_ELECTRIC_HEATER_ID
    }
  });
  const state = new State()
  state.state = stateValue;
  state.electricHeater = electricHeater;
  const lastState = await AppDataSource.getRepository(State).findOne({
    where: {
      electricHeater: electricHeater,
    },
    order: {
      date: 'DESC'
    },
  });
  await AppDataSource.getRepository(State).save(state);
  if (lastState && lastState.state === EState.ON && stateValue === EState.OFF) {
    const runTime = new RunTime();
    runTime.electricHeater = electricHeater;
    runTime.runTime = state.date.getTime() - lastState.date.getTime();
    console.log(await AppDataSource.manager.save(runTime));
  }
  return state;
}

export const changeElectricHeaterStateIfNeeded = async (client: AsyncMqttClient) => {
  const dht11Stat = await AppDataSource.manager.findOne(DHT11Stats, { order: { id: 'DESC' } });
  const electricHeaterState = await AppDataSource.manager.findOne(State, { order: { id: 'DESC' } });
  const temperatureConfig = await AppDataSource.manager.findOne(TemperatureConfig, { order: { id: 'DESC' } });
  let minTemperature = 20;
  let maxTemperature = 22;
  if (temperatureConfig) {
    minTemperature = temperatureConfig.minTemperature;
    maxTemperature = temperatureConfig.maxTemperature;
  }
  if (dht11Stat && electricHeaterState) {
    console.log(dht11Stat, minTemperature, maxTemperature);
    if (dht11Stat.temperature <= minTemperature && electricHeaterState.state === EState.OFF) {
      await onElectricHeater(client);
    }
    if (dht11Stat.temperature >= maxTemperature && electricHeaterState.state === EState.ON) {
      await offElectricHeater(client);
    }
  }
}

export const listenElectricHeater = async (client: AsyncMqttClient) => {
  client.on('message', async (topic, message) => {
    if (topic === process.env.MQTT_ELECTRIC_HEATER_SUBSCRIBE) {
      const state = await saveStateAndRunTime(JSON.parse(message.toString()).POWER === 'ON' ? EState.ON : EState.OFF);
      console.log(state);
    }
  });
  await client.subscribe(process.env.MQTT_ELECTRIC_HEATER_SUBSCRIBE);
}