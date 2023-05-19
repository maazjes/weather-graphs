import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const Loading = (): JSX.Element => (
  <View style={styles.container}>
    <ActivityIndicator color="#37a2da" size="large" />
  </View>
);

export default Loading;
