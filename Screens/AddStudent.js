import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { getDatabase, ref, set } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const AddStudent = ({ navigation }) => {
    const db = getDatabase();
    const [name, setName] = useState('');
    const [parentName, setParentName] = useState('');
    const [uniqueId, setUniqueId] = useState('');
    const [contact, setContact] = useState('');
    const [emergency, setEmergency] = useState('');

    const saveStudent = async () => {
        if (!name || !parentName || !uniqueId || !contact || !emergency) {
            Alert.alert('Please fill all required fields');
            return;
        }
        try {
            const studentsRef = ref(db, `students/${uniqueId}`);
            const studentData = {
                name,
                parentName,
                uniqueId,
                contact,
                emergency,
                date: Date.now(),
            };
            await set(studentsRef, studentData);
            Alert.alert('Student created successfully', '', [
                { text: 'OK', onPress: () => {} }, // You can add a handler or leave it empty
            ]);
            setName('');
            setParentName('');
            setUniqueId('');
            setContact('');
            setEmergency('');
        } catch (error) {
            Alert.alert('Something went wring, please try again', '', [
                { text: 'OK', onPress: () => {} }, // You can add a handler or leave it empty
            ]);
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Add Student</Text>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e Saad Shafqat"
                    placeholderTextColor="#888"
                    onChangeText={(text) => setName(text)}
                    value={name}
                />
                <Text style={{marginVertical:10, fontWeight:'600'}}>
                    Parent Name:
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e Muhammad Shafqat"
                    placeholderTextColor="#888"
                    onChangeText = {(text)=>setParentName(text)}
                    value={parentName}
                />
                <Text style={{marginVertical:10, fontWeight:'600'}}>
                    ID#
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e 202301"
                    placeholderTextColor="#888"
                    // editable={false}
                    onChangeText = {(text)=>setUniqueId(text)}
                    value={uniqueId}
                />
                <Text style={{marginVertical:10, fontWeight:'600'}}>
                   Student Contact:
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e +92 313 7675414"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    onChangeText = {(text)=>setContact(text)}
                    value={contact}
                />
                <Text style={{marginVertical:10, fontWeight:'600'}}>
                    Emergency Contact:
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="i.e +92 320 9380495"
                    placeholderTextColor="#888"
                    onChangeText = {(text)=>setEmergency(text)}
                    value={emergency}
                />
                <TouchableOpacity style={styles.saveButton} onPress={saveStudent}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUNDCOLOR,
        paddingVertical: 40,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        paddingBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: PRIMARYCOLOR,
        marginVertical: 5,
        marginBottom:10,
        marginLeft: 10,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        
    },
    label: {
        marginVertical: 10,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: PRIMARYCOLOR,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 7,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: PRIMARYCOLOR,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddStudent;
