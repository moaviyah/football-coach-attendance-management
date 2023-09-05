import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, TextInput, Alert } from 'react-native';
import { getDatabase, ref, onValue, get, set, update } from 'firebase/database';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { format } from 'date-fns'; // Import the format function
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';

const ChangePassword = ({navigation}) => {
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleUniqueIdInput = (text) => {
    setUniqueId(text);
  };

  const handleContinue = async () => {
    if (!uniqueId) {
      Alert.alert('Missing Information', 'Please enter your unique ID.');
      return;
    }
  
    try {
      const auth = getAuth();
      const database = getDatabase();
      const userRef = ref(database, `users/${uniqueId}`);
      const dataSnapshot = await get(userRef);
  
      if (dataSnapshot.exists()) {
        const userData = dataSnapshot.val();
        // Extract the password and other data as needed
        const fetchedPassword = userData.password;
        const fetchedName = userData.name;
        const userCredential = await signInWithEmailAndPassword(auth, `${fetchedName}@footylink.com`, fetchedPassword);
        const user = userCredential.user;
        // You can use fetchedPassword and fetchedName as needed
        console.log('Fetched Password:', fetchedPassword);
        console.log('Fetched Name:', fetchedName);
  
        // User authenticated, show password change fields
        setShowPasswordFields(true);
      } else {
        console.error('User data not found.');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Invalid unique ID or password. Please try again.');
      console.error('Login Error:', error);
    }
  };
  

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please enter both the new password and confirmation.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The new password and confirmation do not match.');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
        const db = getDatabase()
      // Update the user's password
      await updatePassword(user, password);
      await update(ref(db, `users/${uniqueId}`), {
        password:password
      });
      navigation.goBack()
      Alert.alert('Password Changed', 'Your password has been successfully changed.');

    } catch (error) {
      Alert.alert('Password Change Error', 'An error occurred while changing your password.');
      console.error('Password Change Error:', error);
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
            </TouchableOpacity>
      {!showPasswordFields ? (
        <View>
          <Text style={styles.titleText}>Change Password</Text>
          <Text style={{fontWeight:'600'}}>Enter Unique Id</Text>
          <TextInput
            style={styles.input}
            placeholder="i.e 191176"
            value={uniqueId}
            onChangeText={handleUniqueIdInput}
          />
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.titleText}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUNDCOLOR,
    paddingVertical: 40,
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARYCOLOR,
    marginBottom: 10,
    marginTop:10
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 15,
    marginTop: 20,
    fontSize: 16,
    width: '90%',
  },
  button: {
    backgroundColor: PRIMARYCOLOR,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '80%',
    marginVertical: 30,
    alignSelf:'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ChangePassword;
