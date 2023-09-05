import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, onValue } from 'firebase/database';
import { format } from 'date-fns';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';

const History = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [expandedSessionId, setExpandedSessionId] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [students, setStudents] = useState({});

  useEffect(() => {
    // Fetch the list of sessions from your Firebase database here
    const db = getDatabase();
    const sessionsRef = ref(db, 'sessions');
    onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessionArray = Object.keys(data).map((key) => ({
          sessionId: key,
          ...data[key],
        }));
        setSessions(sessionArray);
      }
    });
  }, []);

  useEffect(() => {
    // Fetch attendance data for each session when it is expanded
    const fetchAttendanceData = async (sessionId) => {
      try {
        const db = getDatabase();
        const attendanceRef = ref(db, `attendance/${sessionId}`);
        onValue(attendanceRef, (snapshot) => {
          const data = snapshot.val() || {};
          setAttendanceData((prevData) => ({
            ...prevData,
            [sessionId]: data,
          }));
        });
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    if (expandedSessionId) {
      fetchAttendanceData(expandedSessionId);
    }
  }, [expandedSessionId]);

  useEffect(() => {
    // Fetch student data
    const db = getDatabase();
    const studentsRef = ref(db, 'students');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStudents(data);
      }
    });
  }, []);

  const toggleSessionExpansion = (sessionId) => {
    if (expandedSessionId === sessionId) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(sessionId);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUNDCOLOR }}>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
        </TouchableOpacity>
        <Text style={styles.titleTxt}>Attendance History</Text>
        {sessions.map((session) => (
          <View key={session.sessionId} style={styles.card}>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => toggleSessionExpansion(session.sessionId)}
            >
              <Text style={styles.cardTitle}>{session.sessionName}</Text>
              <Ionicons
                name={
                  expandedSessionId === session.sessionId
                    ? 'chevron-up-outline'
                    : 'chevron-down-outline'
                }
                size={20}
                color={PRIMARYCOLOR}
                style={styles.cardIcon}
              />
            </TouchableOpacity>
            {expandedSessionId === session.sessionId && (
              <ScrollView style={styles.tableContainer}>
                {Object.keys(attendanceData[session.sessionId] || {}).map((date) => (
                  <View key={date}>
                    <Text style={styles.attendanceDate}>
                      {format(new Date(date), 'EEEE, d MMMM yyyy')}
                    </Text>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableHeader}>ID</Text>
                      <Text style={styles.tableHeader}>Name</Text>
                      <Text style={styles.tableHeader}>Status</Text>
                    </View>
                    {Object.keys(students).map((studentId) => (
                      <View key={studentId} style={styles.tableRow}>
                        <Text style={styles.tableDataCell}>{studentId}</Text>
                        <Text style={styles.tableDataCell}>{students[studentId].name}</Text>
                        <Text
                          style={[
                            styles.tableDataCell,
                            styles.attendanceStatus,
                            attendanceData[session.sessionId][date][studentId]
                              ? styles.presentText
                              : styles.absentText,
                          ]}
                        >
                          {attendanceData[session.sessionId][date][studentId]
                            ? 'Present'
                            : 'Absent'}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        ))}
      </ScrollView>
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
  backButton: {
    marginBottom: 20,
  },
  titleTxt: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: PRIMARYCOLOR,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  historyButton: {
    backgroundColor: '#ecf1ff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: PRIMARYCOLOR,
  },
  cardIcon: {
    marginLeft: 10,
  },
  tableContainer: {
    marginTop: 15,
  },
  tableRow: {
    flexDirection: 'row',
    
    paddingVertical: 10,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
   
    textAlign: 'center',
  },
  tableDataCell: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 5,
    textAlign: 'center',
  },
  attendanceDate: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  attendanceStatus: {
    marginTop: 5,
  },
  presentText: {
    color: '#588157',
  },
  absentText: {
    color: '#dc2f02',
  },
});

export default History;
