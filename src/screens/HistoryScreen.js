import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../services/supabase";

export default function HistoryScreen() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("bmi_records")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setRecords(data || []);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial IMC</Text>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.bmi}>IMC: {item.bmi.toFixed(2)}</Text>
            <Text>Peso: {item.weight} kg</Text>
            <Text>Altura: {item.height} m</Text>
            <Text>{new Date(item.created_at).toLocaleDateString()}</Text>

            <TouchableOpacity
              onPress={async () => {
                await supabase.from("bmi_records").delete().eq("id", item.id);
                fetchHistory();
              }}
            >
              <Text style={styles.delete}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  bmi: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4CAF50",
  },
  delete: {
    marginTop: 10,
    color: "red",
    fontWeight: "bold",
  },
});
