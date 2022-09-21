import { AsyncMqttClient } from "async-mqtt";
import { AppDataSource } from "./data-source";
import { TemperatureConfig } from "./entity/TemperatureConfig";

const saveTemperatureConfig = async (message: Buffer) => {
  const [minTemperature, maxTemperature] = message.toString().split(',');
  const temperatureConfig = new TemperatureConfig();
  temperatureConfig.minTemperature = Number(minTemperature);
  temperatureConfig.maxTemperature = Number(maxTemperature);
  return await AppDataSource.manager.save(temperatureConfig);
}

export const listenTemperatureConfig = async (client: AsyncMqttClient) => {
  client.on('message', async (topic, message) => {
    if (topic === process.env.MQTT_TEMPERATURE_CONFIG_PUBLISH) {
      const config = await saveTemperatureConfig(message);
      console.log(process.env.MQTT_TEMPERATURE_CONFIG_SUBSCRIBE, JSON.stringify(config));
      await client.publish(process.env.MQTT_TEMPERATURE_CONFIG_SUBSCRIBE, JSON.stringify(config));
    }
  });
  await client.subscribe(process.env.MQTT_TEMPERATURE_CONFIG_PUBLISH);
}