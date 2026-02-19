import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";

export default function CalculatorScreen() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const getCategory = (bmi) => {
    if (bmi < 18.5) return { label: "Bajo peso", color: "#2196F3" };
    if (bmi < 25) return { label: "Normal", color: "#4CAF50" };
    if (bmi < 30) return { label: "Sobrepeso", color: "#FFC107" };
    return { label: "Obesidad", color: "#F44336" };
  };

  const calculateBMI = async () => {
    if (!weight || !height) {
      Alert.alert("Completa todos los campos");
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum) || heightNum <= 0) {
      Alert.alert("Ingresa valores válidos");
      return;
    }

    const bmi = weightNum / (heightNum * heightNum);
    const bmiFixed = bmi.toFixed(2);

    setResult(bmiFixed);

    // Guardar en Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("bmi_records").insert([
      {
        user_id: user.id,
        weight: weightNum,
        height: heightNum,
        bmi: parseFloat(bmiFixed),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calcular IMC</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Peso (kg)"
          style={styles.input}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TextInput
          placeholder="Altura (m) Ej: 1.75"
          style={styles.input}
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />

        <TouchableOpacity style={styles.button} onPress={calculateBMI}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>IMC: {result}</Text>

            <Text
              style={[
                styles.category,
                { color: getCategory(parseFloat(result)).color },
              ]}
            >
              {getCategory(parseFloat(result)).label}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  category: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
});
