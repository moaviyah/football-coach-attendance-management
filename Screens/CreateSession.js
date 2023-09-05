import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, ScrollView, Alert } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';
import { getDatabase, ref, push, set, onValue, update, get } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo icons

const CreateSession = ({ navigation }) => {
    const [sessionName, setSessionName] = useState('');
    const [coachName, setCoachName] = useState('');
    const [coachContact, setCoachContact] = useState('');

    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

    const showStartDatePicker = () => {
        setStartDatePickerVisible(true);
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisible(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisible(false);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisible(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd MMMM yyyy');
    };
    const fetchStudents = async () => {
        try {
            const db = getDatabase();
            const studentsRef = ref(db, 'students');
            const snapshot = await get(studentsRef);
    
            if (snapshot.exists()) {
                const studentsData = snapshot.val();
                const studentsArray = Object.keys(studentsData).map(studentId => ({
                    id: studentId,
                    ...studentsData[studentId],
                }));
                return studentsArray;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            return [];
        }
    };

    const saveSession = async () => {
        if (!sessionName || !selectedStartDate || !selectedEndDate || !coachName || !coachContact) {
            Alert.alert('Fill All Fields', 'Please fill in all required fields.');
            return;
          }
        try {
            const db = getDatabase();
            const sessionsRef = ref(db, 'sessions');
            const newSessionRef = push(sessionsRef);
            const sessionId = newSessionRef.key;
    
            const sessionData = {
                sessionName,
                startDate: selectedStartDate,
                endDate: selectedEndDate,
                coachName,
                coachContact,
                sessionId
            };
            await set(newSessionRef, sessionData)
            setSessionName('')
            setSelectedStartDate('')
            setSelectedEndDate('')
            setCoachContact('')
            setCoachName('')
            Alert.alert("Session Created Successfully")
            const students = await fetchStudents();
            const initialEnrollment = students.reduce((enrollmentObj, student) => {
                enrollmentObj[student.id] = false;
                return enrollmentObj;
            }, {});
            const sessionsEnrollmentRef = ref(db, `sessions/${sessionId}/enrolled`);
            await update(sessionsEnrollmentRef, initialEnrollment)
            console.log(`Created Session with ID ${sessionId}`);
        } catch (error) {
            console.error('Error creating session:', error);
        }
       
    };

    return (
        <ScrollView style={styles.container}>
            <View style={{ flexDirection: 'row', paddingBottom: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
                </TouchableOpacity>
            </View>
            <Text style={styles.titleTxt}>Create Session</Text>
            <View>
                <Text style={{ fontWeight: '600', marginVertical: 10, }}>
                    Session Name
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Summer Camp23"
                    value={sessionName}
                    onChangeText={setSessionName}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '600', marginVertical: 10, marginRight: 50 }}>
                        Start Date:
                    </Text>
                    <TouchableOpacity style={styles.datePickerButton} onPress={showStartDatePicker}>
                        <Text>{selectedStartDate ? formatDate(selectedStartDate) : 'Select'}</Text>
                    </TouchableOpacity>
                </View>
                {isStartDatePickerVisible && (
                    <Calendar
                        onDayPress={(day) => {
                            setSelectedStartDate(day.dateString);
                            hideStartDatePicker();

                        }}
                        markedDates={{ [selectedStartDate]: { selected: true } }}
                    />
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '600', marginVertical: 10, marginRight: 57 }}>
                        End Date:
                    </Text>
                    <TouchableOpacity style={styles.datePickerButton} onPress={showEndDatePicker}>
                        <Text>{selectedEndDate ? formatDate(selectedEndDate) : 'Select'}</Text>
                    </TouchableOpacity>
                </View>
                {isEndDatePickerVisible && (
                    <Calendar
                        onDayPress={(day) => {
                            setSelectedEndDate(day.dateString);
                            hideEndDatePicker();
                        }}
                        markedDates={{ [selectedEndDate]: { selected: true } }}
                    />
                )}
                <Text style={{ fontWeight: '600', marginVertical: 10 }}>
                    Coach's Name
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Williams"
                    value={coachName}
                    onChangeText={setCoachName}
                />
                <Text style={{ fontWeight: '600', marginVertical: 10 }}>
                    Coach's Contact
                </Text>
                <TextInput
                    style={styles.input}
                    value={coachContact}
                    onChangeText={setCoachContact}
                    placeholder='Email, Phone, Whatsapp'
                />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveSession}>
                <Text style={styles.buttonText}>
                    Save
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CreateSession;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: BACKGROUNDCOLOR,
        paddingVertical: 40,
        paddingHorizontal: 15,
    },
    titleTxt: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
        color: PRIMARYCOLOR
    },
    input: {
        borderWidth: 1,
        borderColor: PRIMARYCOLOR,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: PRIMARYCOLOR,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center',
        marginTop: 15
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    datePickerButton: {
        borderWidth: 1,
        borderColor: PRIMARYCOLOR,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
        marginBottom: 15,
        fontSize: 16,
        alignItems: 'center',
        width: '50%'
    },
});