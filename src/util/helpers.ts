import { Dimensions, PixelRatio } from "react-native";

const getDate = () => {
  let yourDate = new Date();
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
  return yourDate.toISOString().split("T")[0];
};

const dpw = (widthPercent: number): number => {
  const screenWidth = Dimensions.get("window").width;
  return PixelRatio.roundToNearestPixel(screenWidth * widthPercent);
};

export { getDate, dpw };
