import { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import { SVGRenderer } from "@wuba/react-native-echarts";
import { SkiaChart } from "@wuba/react-native-echarts";
import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { EChartsOption } from "echarts/types/dist/shared";

echarts.use([SVGRenderer, LineChart, GridComponent, LegendComponent]);

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

type EchartProps = {
  config: EChartsOption;
};

const EChart = ({ config }: EchartProps) => {
  const skiaRef = useRef<any>(null);
  useEffect(() => {
    const option = config;
    let chart: any;
    if (skiaRef.current) {
      chart = echarts.init(skiaRef.current, "light", {
        renderer: "svg",
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT / 1.5,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [config]);

  return <SkiaChart ref={skiaRef} />;
};

export default EChart;
