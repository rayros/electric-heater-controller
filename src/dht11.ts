import { AsyncMqttClient } from "async-mqtt";
import { AppDataSource } from "./data-source";
import { changeElectricHeaterStateIfNeeded } from "./electric-heater";
import { DHT11Stats } from "./entity/DHT11Stats";

export const listenDHT11 = async (client: AsyncMqttClient) => {
  client.on('message', async (topic, message) => {
    if (topic === process.env.MQTT_DHT11_SUBSCRIBE) {
      await saveStats(message);
      await changeElectricHeaterStateIfNeeded(client);
    }
  });
  await client.subscribe(process.env.MQTT_DHT11_SUBSCRIBE);
}

export const saveStats = async (message: Buffer) => {
  const stats = JSON.parse(message.toString());
  const dht11 = new DHT11Stats();
  dht11.temperature = stats.DHT11.Temperature;
  dht11.humidity = stats.DHT11.Humidity;
  dht11.dewPoint = stats.DHT11.DewPoint;
  dht11.device_id = '1';
  await AppDataSource.manager.save(dht11);
}