import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
const TakeAttendance = ({ navigation }) => {
  const route = useRoute();
  const { sessionId, studentIds, Name } = route.params;
  const db = getDatabase();
  const [studentData, setStudentData] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date.dateString);
    setShowCalendar(!showCalendar);
  };

  const handleToggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  useEffect(() => {
    const studentsRef = ref(db, 'students');

    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const studentArray = studentIds.map((studentId) => ({
          studentId: studentId,
          name: data[studentId].name,
          isChecked: false,
        }));
        setStudentData(studentArray);
      }
    });
  }, [studentIds]);

  const handleCheckboxChange = (studentId) => {
    setStudentData((prevStudentData) =>
      prevStudentData.map((student) =>
        student.studentId === studentId ? { ...student, isChecked: !student.isChecked } : student
      )
    );
  };

  const handleSaveAttendance = () => {
    // Show an alert to confirm the action
    Alert.alert(
      'Confirm Save Attendance',
      'Are you sure you want to save the attendance? It will overwrite the attendance if you have took attendance for this date before!',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            // User confirmed, proceed with saving attendance
            const attendance = {};
            studentData.forEach((student) => {
              attendance[student.studentId] = student.isChecked;
            });

            const attendanceRef = ref(db, `attendance/${sessionId}/${selectedDate}`);
            set(attendanceRef, attendance);

            console.log('Attendance data:', attendance);
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUNDCOLOR }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateButton} onPress={handleToggleCalendar}>
            <Text style={styles.dateButtonText}>Date: {selectedDate}</Text>
          </TouchableOpacity>
        </View>
        {showCalendar && (
          <Calendar
            style={styles.calendar}
            current={selectedDate}
            onDayPress={handleDateChange}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: PRIMARYCOLOR },
            }}
          />
        )}
        <Text style={styles.titleTxt}>Take Attendance for {Name}</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>ID</Text>
          <Text style={styles.tableHeader}>Name</Text>
          <Text style={styles.tableHeader}>Status</Text>
        </View>
        <FlatList
          data={studentData}
          keyExtractor={(item) => item.studentId}
          renderItem={({ item }) => (
            <View style={styles.studentItem}>
              <Text>{item.studentId}</Text>
              <Text>{item.name}</Text>
              <BouncyCheckbox
                value={item.isChecked}
                onPress={() => handleCheckboxChange(item.studentId)}
              />
            </View>
          )}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAttendance}>
          <Text style={styles.saveButtonText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUNDCOLOR,
    marginHorizontal: 15,
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  backButton: {},
  titleTxt: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARYCOLOR,
    marginBottom: 15,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: PRIMARYCOLOR,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  tableHeader: {
    flex: 1,
    fontWeight: '700',
    marginLeft: 30,
  },
  calendar: {
    marginBottom: 10,
  },
  dateButton: {
    marginLeft: 'auto',
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: PRIMARYCOLOR,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dateButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default TakeAttendance;
