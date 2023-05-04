import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

const App = () => {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image style={styles.logo} source={require("./assets/logo.png")} />
        <TextInput placeholder="example@gmail.com" style={styles.input} />
        <TextInput placeholder="********" style={styles.input} />
        <TouchableOpacity style={styles.btnContainer}>
          <Text style={styles.btnText}>Log in</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Pressable>
            <Text style={styles.linkText}>Sign up</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.linkText}>Forget password</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default App;

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  logo: {
    height: 125,
    width: 125,
    marginTop: height * 0.1,
    marginBottom: 25,
    alignSelf: "center",
  },

  input: {
    width: width - 40,
    backgroundColor: "#eae9e7",
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    // color: '#8469cf',
    marginBottom: 20,
  },

  btnContainer: {
    width: width - 40,
    backgroundColor: "#f44f33",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontSize: 20,
  },

  linkText: {
    fontSize: 16,
    color: "#8469cf",
  },

  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
