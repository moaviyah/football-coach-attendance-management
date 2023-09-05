import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth, signOut } from 'firebase/auth';

const DashboardCoach = ({ navigation }) => {
  const [students, setStudents] = useState();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const auth = getAuth();
  const db = getDatabase()
  useEffect(() => {
    const studentsRef = ref(db, 'students');
    const sessionRef = ref(db, 'sessions');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentArray = Object.keys(data).map((key) => ({
          uniqueId: key,
          ...data[key],
        }));
        setStudents(studentArray);
        setTotalStudents(studentArray.length)
      }
    });
    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sessionArray = Object.keys(data).map((key) => ({

          ...data[key],
        }));

        setTotalSessions(sessionArray.length)
      }
    });
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          onPress: async () => {
            try {
              await signOut(auth);
              // Navigate to the login or logout screen
              navigation.navigate('Login'); // Replace 'Login' with your actual login/logout screen
            } catch (error) {
              console.error('Error logging out:', error);
              // Handle any errors during logout
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  return (
    <ScrollView style={{ backgroundColor: BACKGROUNDCOLOR }} contentContainerStyle={styles.container}>

      <Text style={styles.titleTxt}>Coaching Dashboard</Text>

      <View style={styles.rowContainer}>

        <TouchableOpacity
          style={{ backgroundColor: '#f5f9ff', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: PRIMARYCOLOR, alignItems: 'center' }}
          onPress={() => navigation.navigate('ManageStudents')}
        >
          <Text style={styles.tabTxt}>Manage Students</Text>
          <Text style={styles.tabTxt}>{totalStudents}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ backgroundColor: '#fafdf5', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: '#c4d6a4', alignItems: 'center' }}
          onPress={() => navigation.navigate('CoachingSessions')}
        >
          <Text style={styles.tabTxt}>Coaching Sessions</Text>
          <Text style={styles.tabTxt}>{totalSessions}</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.rowContainer}>

        <TouchableOpacity
          style={{ backgroundColor: '#dcf4f1', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: '#93c4bc', alignItems: 'center' }}
          onPress={() => navigation.navigate("Attendance")}
        >
          <Text style={styles.tabTxt}>Manage Attendance</Text>
        </TouchableOpacity>
        <Text>

        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#fff9f8', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: '#f4b5ab', alignItems: 'center' }}
          onPress={handleLogout}
        >
          <Text style={[styles.tabTxt,]}>Log Out</Text>

        </TouchableOpacity>

      </View>

      {/* <Text style={[styles.titleTxt, { marginVertical: 15 }]}>Upcoming Events</Text>
      <Text style={{ alignSelf: 'center' }}>No Upcoming Events Soon!</Text> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUNDCOLOR,
    paddingVertical: 40,
    paddingHorizontal: 15,
  },
  titleTxt: {
    fontSize: 18,
    fontWeight: '700',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 10
  },
  box: {
    width: '48%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabTxt: {
    fontSize: 15,
    fontWeight: '600'
  }
});

export default DashboardCoach;
