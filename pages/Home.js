import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert, TextInput } from 'react-native';
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

  // 4. STATE & REF UNTUK CATATAN (Baru)
  const [note, setNote] = useState("");
  const noteInputRef = useRef(null); // Membuat "kait" kosong untuk elemen input

  // EFEK SIKLUS HIDUP (Jam Real-time)
  useEffect(() => {
    const timer = setInterval(() => {
      const timeString = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      setCurrentTime(timeString);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 5. OPTIMASI KOMPUTASI DENGAN useMemo (Baru)
  const attendanceStats = useMemo(() => {
    // Teks ini HANYA akan tercetak di terminal jika historyData bertambah, bukan setiap detik!
    console.log("Menghitung ulang statistik kehadiran...");
    
    const presentCount = historyData.filter(item => item.status === 'Present').length;
    const absentCount = historyData.filter(item => item.status === 'Absent').length;
    
    return { totalPresent: presentCount, totalAbsent: absentCount };
  }, [historyData]); // Hanya hitung ulang kalau historyData berubah

  // FUNGSI LOGIKA ABSEN (Diperbarui)
  const handleCheckIn = () => {
    if (isCheckedIn) {
      Alert.alert("Perhatian", "Anda sudah melakukan Check In.");
      return;
    }

    // Validasi Catatan menggunakan useRef
    if (note.trim() === '') {
      Alert.alert("Peringatan", "Catatan kehadiran wajib diisi!");
      noteInputRef.current.focus(); // Sihir useRef: Memaksa kursor pindah ke input
      return;
    }

    // 1. Buat data presensi baru
    const newAttendance = {
      id: Date.now().toString(),
      course: "Mobile Programming",
      date: new Date().toLocaleDateString('id-ID'),
      status: "Present",
    };

    // 2. Masukkan data baru ke urutan paling atas daftar
    setHistoryData([newAttendance, ...historyData]);
    
    // 3. Kunci tombol Check In
    setIsCheckedIn(true);
    Alert.alert("Sukses", `Berhasil Check In pada pukul ${currentTime}`);
  };

  // Tampilan per-item untuk daftar history
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

          {/* Kolom Input Catatan dengan useRef (Hanya muncul jika belum absen) */}
          {!isCheckedIn && (
            <TextInput
              ref={noteInputRef} // Menempelkan referensi ke elemen ini
              style={styles.inputCatatan}
              placeholder="Tulis catatan (cth: Hadir lab)"
              value={note}
              onChangeText={setNote}
            />
          )}

          {/* Tombol Check In */}
          <TouchableOpacity
            style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
            onPress={handleCheckIn}
            disabled={isCheckedIn}
          >
            <Text style={styles.buttonText}>
              {isCheckedIn ? "CHECKED IN" : "CHECK IN"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fitur Baru: Statistik Kehadiran (Hasil useMemo) */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.totalPresent}</Text>
            <Text style={styles.statLabel}>Total Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: 'red' }]}>{attendanceStats.totalAbsent}</Text>
            <Text style={styles.statLabel}>Total Absent</Text>
          </View>
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

// Styling Gabungan
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold' },
  clockText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', fontVariant: ['tabular-nums'] },
  card: { flexDirection: 'row', backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 2, alignItems: 'center' },
  icon: { backgroundColor: '#e0e0e0', padding: 10, borderRadius: 30, marginRight: 15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  classCard: { backgroundColor: 'white', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 2 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  
  // Style Kolom Input Baru
  inputCatatan: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 15,
    backgroundColor: '#fafafa',
  },

  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonActive: { backgroundColor: '#007AFF' },
  buttonDisabled: { backgroundColor: '#ABC4FF' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // Style Statistik Baru
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: 'green' },
  statLabel: { fontSize: 14, color: 'gray' },

  historyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  historyCourse: { fontSize: 16, fontWeight: '500' },
  historyDate: { color: 'gray', fontSize: 12, marginTop: 4 },
  historyStatus: { fontWeight: 'bold', fontSize: 14 },
  statusPresent: { color: 'green' },
  statusAbsent: { color: 'red' }
});

export default Home;