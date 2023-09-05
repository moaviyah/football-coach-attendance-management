import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';

const SignUpCoach = ({navigation}) => {

  const [password, setPassword] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('')
  const auth = getAuth();
  const db = getDatabase();

  const handleInputChange = (text, inputType) => {
    if (inputType === 'password') {
      setPassword(text);
    } else if (inputType === 'uniqueId') {
      setUniqueId(text);
    } else if (inputType === 'repeatPassword') {
      setRepeatPassword(text);
    }
  };

  const handleInputFocus = (inputType) => {
    if (inputType === 'password' && password === '') {
      setPassword(' ');
    } else if (inputType === 'uniqueId' && uniqueId === '') {
      setUniqueId(' ');
    }else if (inputType === 'repeatPassword' && repeatPassword === '') {
      setRepeatPassword(' ');
    }
  };

  const handleSignUp = async () => {
    if (!password || !uniqueId ||! repeatPassword) {
      Alert.alert('All fields are required');
      return;
    }
    else if(password !== repeatPassword){
      Alert.alert('Passwords do not match!')
      return
    }
    // Check if uniqueId exists in the students' data
    const studentsRef = ref(db, 'students');
    const studentSnapshot = await get(studentsRef);
    // if (!studentSnapshot.exists() || !studentSnapshot.hasChild(uniqueId)) {
    //   Alert.alert('Invalid Unique ID');
    //   return;
    // }
    
    try {
      
      const userCredential = await createUserWithEmailAndPassword(auth, `${uniqueId}@footylink.com`, password);

      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: uniqueId });
        Alert.alert('Account created successfully')
        
        // For example, you can set user's name, profile picture, etc.
        await set(ref(db, `users/${uniqueId}`), {
          name: uniqueId,
          uniqueId: uniqueId,
          role: 'student',
          password:password
        });
        setPassword('')
        setUniqueId('')
        setRepeatPassword('')
        navigation.navigate('DashboardParent')
        // Navigate to your app's main screen after successful signup.
        // Replace 'MainScreen' with your actual main screen component.
        // navigation.navigate('MainScreen');
      }
    } catch (error) {
      Alert.alert(`Error signing up ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/footballIcon.png')} style={{ height: 100, width: 100, marginVertical: 10 }} />
      <Text style={styles.titleText}>
        Footy-Link
      </Text>
      <TextInput
        style={[styles.input, { borderColor: uniqueId === '' ? '#ccc' : PRIMARYCOLOR }]}
        placeholder="Player's Unique Id"
        value={uniqueId}
        placeholderTextColor={uniqueId === '' ? '#888' : PRIMARYCOLOR}
        
        onChangeText={(text) => handleInputChange(text, 'uniqueId')}
      />
     
      <TextInput
        style={[styles.input, { borderColor: password === '' ? '#ccc' : PRIMARYCOLOR }]}
        placeholder="Password"
        value={password}
        placeholderTextColor={password === '' ? '#888' : PRIMARYCOLOR}
        secureTextEntry
        onChangeText={(text) => handleInputChange(text, 'password')}
      />
      <TextInput
        style={[styles.input, { borderColor: repeatPassword === '' ? '#ccc' : PRIMARYCOLOR }]}
        placeholder="Repeat Password"
        value={repeatPassword}
        placeholderTextColor={repeatPassword === '' ? '#888' : PRIMARYCOLOR}
        secureTextEntry
        onFocus={() => handleInputFocus('repeatPassword')}
        onBlur={() => {
          if (repeatPassword.trim() === '') {
            setRepeatPassword('');
          }
        }}
        onChangeText={(text) => handleInputChange(text, 'repeatPassword')}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

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
})

export default SignUpCoach;
