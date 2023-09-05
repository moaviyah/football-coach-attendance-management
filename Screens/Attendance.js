import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo icons
import { BACKGROUNDCOLOR, PRIMARYCOLOR, SECONDARYCOLOR } from '../colors';

const Attendance = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const sessionsRef = ref(db, 'sessions');

    onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const sessionArray = Object.keys(data)
          .map((sessionId) => {
            const sessionData = data[sessionId];
            const enrolledStudents = sessionData.enrolled || {};
            const enrolledIds = Object.keys(enrolledStudents).filter(studentId => enrolledStudents[studentId] === true);
            const enrolledCount = Object.values(enrolledStudents).filter(status => status).length;
            return {
              sessionId: sessionId,
              sessionName: sessionData.sessionName,
              enrolled: enrolledCount,
              enrolledIds: enrolledIds,
            };
          });

        setSessions(sessionArray);
      }
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUNDCOLOR }}>
      <View style={styles.container}>
        <View style={
          {
            flexDirection:'row',
            paddingBottom: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
          }
          }>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
        </TouchableOpacity>
        <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => navigation.navigate('History')}
                >
                    <Ionicons name="eye" size={20} color={PRIMARYCOLOR} 
                    style={
                      { 
                        marginRight: 5,
                        
                      }
                    } 
                    />
                    <Text style={styles.historyButtonLabel}>See History</Text>
                </TouchableOpacity>
        </View>
        <Text style={styles.titleTxt}>Attendance</Text>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.sessionId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                const sessionId = item.sessionId;
                const studentIds = item.enrolledIds;
                const Name = item.sessionName;
                navigation.navigate('TakeAttendance', { sessionId, studentIds, Name });
              }}
            >
              <View style={styles.sessionInfo}>
                <Text style={styles.cardTitle}>{item.sessionName}</Text>
                <Text style={styles.enrolledText}>{item.enrolled} Enrolled</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={PRIMARYCOLOR} />
            </TouchableOpacity>
          )}
        />
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
  backButton: {
    marginBottom: 20,
  },
  titleTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyButtonLabel: {
    fontSize: 16,
    color: PRIMARYCOLOR,
    fontWeight: '600',
    marginLeft: 5,
},
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 5,
    color:PRIMARYCOLOR
  },
  enrolledText: {
    color: SECONDARYCOLOR,
  },
  card: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2, // Add a shadow effect
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
historyButton: {
  backgroundColor: '#ecf1ff',
  paddingHorizontal: 20,
  paddingVertical: 15,
  flexDirection: 'row',
  borderRadius: 8,
  alignItems: 'center',
},
cardTitle: {
  fontWeight: '600',
  fontSize: 16,
  color: PRIMARYCOLOR,
},
cardIcon: {
  marginLeft: 10,
},
});

export default Attendance;
