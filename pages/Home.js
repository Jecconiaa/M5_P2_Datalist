import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Data Awal (Initial State)
const initialHistory = [
  { id: "1", course: "Web Programming", date: "2026-03-01", status: "Absent" },
  { id: "2", course: "Database System", date: "2026-03-02", status: "Present" }
];

const Home = () => {
  // 1. STATE UNTUK RIWAYAT PRESENSI
  const [historyData, setHistoryData] = useState(initialHistory);
  
  // 2. STATE UNTUK STATUS TOMBOL CHECK-IN
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  // 3. STATE UNTUK JAM DIGITAL
  const [currentTime, setCurrentTime] = useState("Memuat jam...");

  // EFEK SIKLUS HIDUP (Jam Real-time)
  useEffect(() => {
    // Jalankan timer setiap 1000 milidetik (1 detik)
    const timer = setInterval(() => {
      const timeString = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      setCurrentTime(timeString);
    }, 1000);

    // CLEANUP: Matikan timer jika layar ditutup
    return () => clearInterval(timer);
  }, []); // Array kosong artinya jalankan hanya satu kali saat awal dibuka

  // FUNGSI LOGIKA ABSEN
  const handleCheckIn = () => {
    if (isCheckedIn) {
      Alert.alert("Perhatian", "Anda sudah melakukan Check In untuk kelas ini.");
      return;
    }

    // 1. Buat data presensi baru
    const newAttendance = {
      id: Date.now().toString(), // Buat ID unik dari timestamp
      course: "Mobile Programming",
      date: new Date().toLocaleDateString('id-ID'), // Tanggal hari ini
      status: "Present"
    };

    // 2. Masukkan data baru ke urutan paling atas daftar history
    setHistoryData([newAttendance, ...historyData]);
    
    // 3. Kunci tombol Check In
    setIsCheckedIn(true);
    Alert.alert("Sukses", `Berhasil Check In pada pukul ${currentTime}`);
  };

  // Tampilan per-item untuk daftar history (Bawaan W2 yang disesuaikan)
  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View>
        <Text style={styles.historyCourse}>{item.course}</Text>
        <Text style={styles.historyDate}>{item.date}</Text>
      </View>
      <Text style={[styles.historyStatus, item.status === 'Absent' ? styles.statusAbsent : styles.statusPresent]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Jam */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>

        {/* Student Card */}
        <View style={styles.card}>
          <View style={styles.icon}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>Bevin Jeconia Clarence Suryaatmaja</Text>
            <Text>NIM: 0920240014</Text>
            <Text>Class: Informatika-2B</Text>
          </View>
        </View>

        {/* Today's Class */}
        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text>Mobile Programming</Text>
          <Text>08:00 - 10:00</Text>
          <Text>Lab 3</Text>

          {/* Modifikasi Tombol Check In */}
          <TouchableOpacity
            style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
            onPress={handleCheckIn}
            disabled={isCheckedIn} // Matikan fungsi klik jika sudah absen
          >
            <Text style={styles.buttonText}>
              {isCheckedIn ? "CHECKED IN" : "CHECK IN"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Attendance History */}
        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Attendance History</Text>
          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  content: {
    padding: 20,
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15
  },
  name: {
    fontSize: 18,
    fontWeight: "bold"
  },
  classCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  summaryCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  presentText: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold"
  },
  absentText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold"
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  course: {
    fontSize: 16,
    fontWeight: "bold"
  },
  date: {
    fontSize: 12,
    color: "gray",
    marginTop: 5
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  present: {
    color: "green",
    fontWeight: "bold"
  },
  absent: {
    color: "red",
    fontWeight: "bold"
  }
});

export default Home;