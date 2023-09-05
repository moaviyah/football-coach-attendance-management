import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { getAuth, signOut } from 'firebase/auth';

const DashboardParent = ({ navigation }) => {
  const auth = getAuth();

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
              console.log(auth.currentUser.displayName , 'has signed out')
              await signOut(auth);
             
              navigation.navigate('Login')
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

      <Text style={styles.titleTxt}>Parent Dashboard</Text>

      <View style={styles.rowContainer}>

        <TouchableOpacity
          style={{ backgroundColor: '#dcf4f1', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: '#93c4bc', alignItems: 'center' }}
          onPress={() => navigation.navigate("AttendanceReport")}
        >
          <Text style={styles.tabTxt}>Attendance Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{ backgroundColor: '#f5f9ff', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: PRIMARYCOLOR, alignItems: 'center' }}
          onPress={() => navigation.navigate('EnrolledSessions')}
        >
          <Text style={styles.tabTxt}>Enrolled Sessions</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.rowContainer}>

        <TouchableOpacity
          style={{ backgroundColor: '#fff9f8', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: '#f4b5ab', alignItems: 'center' }}
          onPress={handleLogout}
        >
          <Text style={[styles.tabTxt]}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#fff9f8', paddingVertical: '15%', marginHorizontal: 5, width: '52%', borderRadius: 20, borderWidth: 1.5, borderColor: '#f4b5ab', alignItems: 'center', opacity:0}}
          disabled 
        >
          <Text style={[styles.tabTxt]}>Log Out</Text>
        </TouchableOpacity>
      </View>
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
  tabTxt: {
    fontSize: 15,
    fontWeight: '600'
  }
});

export default DashboardParent;
