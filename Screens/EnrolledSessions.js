import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';

import { format } from 'date-fns'; // Import the format function
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons
import { getAuth } from 'firebase/auth';

const EnrolledSessions = ({ navigation }) => {
    const [enrolledSessions, setEnrolledSessions] = useState([]);
    const db = getDatabase();
    const auth= getAuth()
    useEffect(() => {
        const currentStudentId = auth.currentUser.displayName;
        const sessionsRef = ref(db, 'sessions');

        onValue(sessionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sessionArray = Object.keys(data)
                    .map((key) => ({
                        uniqueId: key,
                        ...data[key],
                    }))
                    .filter((session) => session.enrolled[currentStudentId]);
                setEnrolledSessions(sessionArray);
            }
        });
    }, []);

    const seeDetails = (session) => {
    navigation.navigate('SeeSessionDetails', { session });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
            </TouchableOpacity>
            <Text style={styles.titleTxt}>Enrolled Sessions</Text>
            <ScrollView>
                {enrolledSessions?.map((session) => (
                    <TouchableOpacity
                        key={session.uniqueId}
                        onPress={() => seeDetails(session)}
                        style={styles.card}
                    >
                        <View>
                            <Text style={styles.sessionTitle}>{session.sessionName}</Text>
                            <Text>Ending on: {format(new Date(session.endDate), 'dd MMMM yyyy')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={PRIMARYCOLOR} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
    backButton: {
        marginBottom: 20,
    },
    titleTxt: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: PRIMARYCOLOR,
    },
});

export default EnrolledSessions;
