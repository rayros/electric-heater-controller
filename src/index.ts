import { connectAsync } from 'async-mqtt';
import { AppDataSource } from "./data-source";
import { listenDHT11 } from './dht11';
import { listenElectricHeater, offElectricHeater } from './electric-heater';
import { listenTemperatureConfig } from './temperature-config';

AppDataSource.initialize()
  .then(async () => {

    const client = await connectAsync(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, {
      username: process.env.MQTT_USER,
      password: process.env.MQTT_PASSWORD
    });

    await listenDHT11(client);
    await listenElectricHeater(client);
    await listenTemperatureConfig(client);

    await offElectricHeater(client);
  })
  .catch((error) => console.log(error));


