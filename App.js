import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import LoginCoach from './Screens/LoginCoach'
import SignUp from './Screens/SignUp'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged,} from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

import DashboardCoach from './Screens/DashboardCoach';
import DashboardParent from './Screens/DashboardParent'
import ManageStudents from './Screens/ManageStudents';
import CoachingSessiosn from './Screens/CoachingSessions';
import Attendance from './Screens/Attendance';
import Events from './Screens/Events';
import AddStudent from './Screens/AddStudent';
import CreateSession from './Screens/CreateSession';
import EnrollStudents from './Screens/EnrollStudents';
import TakeAttendance from './Screens/TakeAttendance';
import History from './Screens/History';
import AttendanceReport from './Screens/AttendanceReport';
import EnrolledSessions from './Screens/EnrolledSessions';
import SeeSessionDetails from './Screens/SeeSessionDetails';
import ChangePassword from './Screens/ChangePassword';

const Stack = createStackNavigator();
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Realtime Database
        const database = getDatabase();
        const userRef = ref(database, `users/${user.uid}`);
        const dataSnapshot = await get(userRef);

        if (dataSnapshot.exists()) {
          const userData = dataSnapshot.val();
          setUser({ uid: user.uid, role: userData.role });
        }
      } else {
        setUser(null);
        console.log('no user')
      }

      if (initializing) {
        setInitializing(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  if (initializing) {
    // Return a loading indicator or splash screen
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator/>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={
        user ?( 
          user.role === 'admin' ? 'DashboardCoach':'DashboardParent'
        ):(
          'Login'
        )

       }>
        <Stack.Screen name="Login" component={LoginCoach} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignUp} options={{ headerShown:false}} />
        <Stack.Screen name='DashboardCoach' component={DashboardCoach} options={{headerShown:false}}/>
        <Stack.Screen name='DashboardParent' component={DashboardParent} options={{headerShown:false}}/>
        <Stack.Screen name='ManageStudents' component={ManageStudents} options={{headerShown:false}}/>
        <Stack.Screen name='CoachingSessions' component={CoachingSessiosn} options={{headerShown:false}}/>
        <Stack.Screen name='Attendance' component={Attendance} options={{headerShown:false}}/>
        <Stack.Screen name='Events' component={Events} options={{headerShown:false}}/>
        <Stack.Screen name='AddStudent' component={AddStudent} options={{headerShown:false}}/>
        <Stack.Screen name='CreateSession' component={CreateSession} options={{headerShown:false}}/>
        <Stack.Screen name='EnrollStudents' component={EnrollStudents} options={{headerShown:false}}/>
        <Stack.Screen name='TakeAttendance' component={TakeAttendance} options={{headerShown:false}}/>
        <Stack.Screen name='History' component={History} options={{headerShown:false}}/>
        <Stack.Screen name='AttendanceReport' component={AttendanceReport} options={{headerShown:false}}/>
        <Stack.Screen name='EnrolledSessions' component={EnrolledSessions} options={{headerShown:false}}/>
        <Stack.Screen name='SeeSessionDetails' component={SeeSessionDetails} options={{headerShown:false}}/>
        <Stack.Screen name='ChangePassword' component={ChangePassword} options={{headerShown:false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
