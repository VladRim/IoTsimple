import React, { useState, Children } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Card from './components/ui/card/Card.jsx';
import CardContent from './components/ui/card/CardContent.jsx';
//import { Card, CardContent } from "./";
import Switch from "./components/ui/switch/Switch.jsx";
import Tabs from "./components/ui/tabs/Tabs.jsx";
import TabList from "./components/ui/tabs/TabList.jsx";
import Tab from "./components/ui/tabs/Tab.jsx";
import TabPanel from "./components/ui/tabs/TabPanel.jsx";
import Input from "./components/ui/input/Input.jsx";
import "./Dashboard.css";

const mockTemperatureData = [
  { timestamp: "12:00", sensor1: -2, sensor2: -1.5, sensor3: -3, sensor4: -2.2 },
  { timestamp: "12:05", sensor1: -1.8, sensor2: -1.6, sensor3: -3.2, sensor4: -2 },
];

const mockDoorData = [true, false, true, false];
const initialLights = [false, false, false, false];
const initialThresholds = { sensor1: -3, sensor2: -3, sensor3: -3, sensor4: -3 };

export default function Dashboard() {
  const [lights, setLights] = useState(initialLights);
  const [thresholds, setThresholds] = useState(initialThresholds);

  return (
    <Tabs>
      <TabList>
        <Tab>Температура</Tab>
        <Tab>Двери</Tab>
        <Tab>Освещение</Tab>
      </TabList>

      {/* Температура */}
      <TabPanel>
        <Card className="dashboard-card">
          <CardContent>
            <h2 className="dashboard-title">Температура в холодильных камерах</h2>
            <div className="threshold-container">
              {Object.keys(thresholds).map((sensor, index) => (
                <div key={index} className="threshold-input">
                  <label>Порог {sensor}:</label>
                  <Input
                    type="number"
                    value={thresholds[sensor]}
                    onChange={(e) => setThresholds({ ...thresholds, [sensor]: parseFloat(e.target.value) })}
                  />
                </div>
              ))}
            </div>
            <LineChart width={600} height={300} data={mockTemperatureData}>
              <XAxis dataKey="timestamp" />
              <YAxis domain={[-10, 5]} />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="sensor1" stroke="#ff0000" />
              <Line type="monotone" dataKey="sensor2" stroke="#00ff00" />
              <Line type="monotone" dataKey="sensor3" stroke="#0000ff" />
              <Line type="monotone" dataKey="sensor4" stroke="#ff00ff" />
            </LineChart>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Двери */}
      <TabPanel>
        <Card className="dashboard-card">
          <CardContent>
            <h2 className="dashboard-title">Состояние дверей</h2>
            <ul>
              {mockDoorData.map((isOpen, index) => (
                <li key={index} className="door-status">
                  Камера {index + 1}: {isOpen ? "Открыта" : "Закрыта"}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Освещение */}
      <TabPanel>
        <Card className="dashboard-card">
          <CardContent>
            <h2 className="dashboard-title">Управление освещением</h2>
            <ul>
              {lights.map((isOn, index) => (
                <li key={index} className="light-control">
                  Камера {index + 1}: <Switch checked={isOn} onCheckedChange={() => {
                    const newLights = [...lights];
                    newLights[index] = !newLights[index];
                    setLights(newLights);
                  }} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabPanel>
    </Tabs>
  );
}
