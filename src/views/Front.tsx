import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EChartsOption } from "echarts/types/dist/shared";

import cities from "../cityCoordinates.json";
import EChart from "../components/EChart";
import Loading from "../components/Loading";
import { getBulkHourlyTemperatures } from "../services/temperatures";
import { dpw } from "../util/helpers";

type Data = {
  temperatures: number[];
  city: string;
};

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const Front = () => {
  const [data, setData] = useState<Data[]>();

  useEffect(() => {
    const initialize = async () => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      AsyncStorage.removeItem(`temperatures-${yesterday.getDay()}`);
      const savedData = await AsyncStorage.getItem(
        `temperatures-${today.getDay()}`
      );

      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        const responses = await getBulkHourlyTemperatures(
          cities.map(city => ({
            latitude: city.coordinates.latitude,
            longitude: city.coordinates.longitude,
          }))
        );

        const newData = responses.map(res => ({
          temperatures: res.hourly.temperature_2m,
          city: `${res.latitude}${res.longitude}`,
        }));

        setData(newData);
        AsyncStorage.setItem(
          `temperatures-${today.getDay()}`,
          JSON.stringify(newData)
        );
      }
    };

    initialize();
  }, []);

  if (!data) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <FlatList
        data={data}
        renderItem={({ item, index }): JSX.Element => {
          const eChartsConfig: EChartsOption = {
            xAxis: {
              type: "category",
              data: Array.from(Array(24).keys()).map(value =>
                value < 10 ? `0${value}:00` : `${value}:00`
              ),
              axisLabel: {
                fontSize: Math.round(dpw(0.035)),
                margin: 11,
              },
            },
            grid: {
              left: "14%",
              right: "6%",
            },
            legend: {
              show: true,
              align: "left",
              orient: "vertical",
              formatter: (name: string) =>
                `${name} ${new Date().toLocaleDateString()}`,
              data: [
                {
                  name: "Temperature",
                  icon: "circle",
                  textStyle: {
                    fontSize: Math.round(dpw(0.044)),
                  },
                },
              ],
            },
            yAxis: {
              type: "value",
              axisLabel: {
                formatter: (value: number) => `${value} °C`,
                fontSize: Math.round(dpw(0.035)),
              },
            },
            series: [
              {
                data: item.temperatures,
                type: "line",
                name: "Temperature",
                showSymbol: false,
              },
            ],
          };

          return (
            <View style={styles.flatListItem}>
              <Text style={styles.cityName}>{cities[index].name}</Text>
              <EChart config={eChartsConfig} />
            </View>
          );
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item): string => item.city}
        removeClippedSubviews
        getItemLayout={(_item, index) => ({
          length: WINDOW_WIDTH,
          offset: index * WINDOW_WIDTH,
          index,
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  flatListItem: {
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  cityName: {
    fontSize: dpw(0.06),
    fontWeight: "bold",
  },
});

export default Front;
