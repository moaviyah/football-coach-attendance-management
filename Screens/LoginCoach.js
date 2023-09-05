import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import app from '../firebase';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] =useState('Coach')
  const handleInputChange = (text, inputType) => {
    if (inputType === 'username') {
      setUsername(text);
    } else if (inputType === 'password') {
      setPassword(text);
    }
  };

  const handleInputFocus = (inputType) => {
    if (inputType === 'username' && username === '') {
      setUsername(' ');
    } else if (inputType === 'password' && password === '') {
      setPassword(' ');
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('Signup'); // Replace 'Signup' with the actual screen name for signup
  };

  const handleForgotPassword = async () => {
    navigation.navigate('ChangePassword')
  };
  const handleLoginButtonPressed = async () => {
    if (!username || !password) {
      Alert.alert('Missing Information', 'Please provide both username and password.');
      return;
    }
  
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, `${username}@footylink.com`, password);
      const user = userCredential.user;
  
      // Fetch user data from Realtime Database
      const database = getDatabase();
      const userRef = ref(database, `users/${username}`);
      const dataSnapshot = await get(userRef);
  
      if (dataSnapshot.exists()) {
        const userData = dataSnapshot.val();
        if (userData.role === 'admin') {
          navigation.navigate('DashboardCoach');
        } else {
          navigation.navigate('DashboardParent');
        }
      } else {
        console.error('User data not found.');
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        // If it's a wrong password error, show an alert with a "Forgot Password" button
        Alert.alert(
          'Login Error',
          'The password you entered is incorrect. Would you like to reset your password?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Reset Password',
              onPress: handleForgotPassword,
            },
          ]
        );
      } else {
        // Handle other types of errors
        Alert.alert('Login Error:', error.message);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/footballIcon.png')} style={{ height: 100, width: 100, marginVertical: 10 }} />
      <Text style={styles.titleText}>
        Footy-Link
      </Text>
      <TextInput
        style={[styles.input, { borderColor: username === '' ? '#ccc' : PRIMARYCOLOR }]}
        placeholder="Username"
        placeholderTextColor={username === '' ? '#888' : PRIMARYCOLOR}
        onFocus={() => handleInputFocus('username')}
        onBlur={() => {
          if (username.trim() === '') {
            setUsername('');
          }
        }}
        onChangeText={(text) => handleInputChange(text, 'username')}
      />
      <TextInput
        style={[styles.input, { borderColor: password === '' ? '#ccc' : PRIMARYCOLOR }]}
        placeholder="Password"
        placeholderTextColor={password === '' ? '#888' : PRIMARYCOLOR}
        secureTextEntry
        onFocus={() => handleInputFocus('password')}
        onBlur={() => {
          if (password.trim() === '') {
            setPassword('');
          }
        }}
        onChangeText={(text) => handleInputChange(text, 'password')}
      />
      <TouchableOpacity onPress={navigateToSignup} style={{ alignSelf: 'flex-end', marginHorizontal: '5%' }}>
        <Text style={styles.signupText}>Register new player ?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLoginButtonPressed}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: '100%',
    backgroundColor: BACKGROUNDCOLOR
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARYCOLOR,
    marginBottom: 30
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
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupText: {
    color: PRIMARYCOLOR,
    fontSize: 16,
    marginTop: 5,

  },
});

export default LoginScreen;
