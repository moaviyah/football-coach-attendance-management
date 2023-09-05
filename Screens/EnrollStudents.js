import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { getDatabase, ref, get, update , set, push} from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const EnrollStudents = ({ closeModal, session }) => {
    const [students, setStudents] = useState([]);
    const [enrollment, setEnrollment] = useState({}); // Add enrollment state
    const sessionId = session.uniqueId
    const toggleEnrollment = async (sessionId, studentId, isEnrolled) => {
        try {
            const db = getDatabase();
            const sessionEnrollmentRef = ref(db, `sessions/${sessionId}/enrolled/${studentId}`);
            await set(sessionEnrollmentRef, isEnrolled);
    
            setEnrollment((prevEnrollment) => ({
                ...prevEnrollment,
                [studentId]: isEnrolled,
            }));
    
            console.log(`Student ${studentId} ${isEnrolled ? 'enrolled' : 'unenrolled'} from session ${sessionId}`);
        } catch (error) {
            console.error('Error toggling enrollment:', error);
        }
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
                setStudents(studentsArray);
            } else {
                setStudents([]);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        }
    };

    useEffect(() => {
        fetchStudents();
        const fetchEnrollment = async () => {
            try {
                const db = getDatabase();
                const sessionEnrollmentRef = ref(db, `sessions/${sessionId}/enrolled`);
                const snapshot = await get(sessionEnrollmentRef);

                if (snapshot.exists()) {
                    setEnrollment(snapshot.val());
                } else {
                    setEnrollment({});
                }
            } catch (error) {
                console.error('Error fetching enrollment:', error);
                setEnrollment({});
            }
        };
        fetchEnrollment();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={closeModal}>
            <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
            </TouchableOpacity>
            <Text style={styles.titleTxt}>Enroll Students</Text>
            <Text style={{fontWeight:'600', fontSize:17, marginTop:10}}>Session: {session.sessionName}</Text>

            <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>ID</Text>
                <Text style={styles.tableHeader}>Name</Text>
                <Text style={styles.tableHeader}>Status</Text>
            </View>
            {students.map(student => (
                <View key={student.id} style={styles.tableRow}>
                    <Text style={styles.tableData}>{student.id}</Text>
                    <Text style={styles.tableData}>{student.name}</Text>
                    <TouchableOpacity
                        style={{
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 5,
                            backgroundColor: enrollment[student.id] ? 'red' : PRIMARYCOLOR,
                        }}
                        onPress={() => toggleEnrollment(sessionId, student.id, !enrollment[student.id])}
                    >
                        <Text style={{color:'white'}}>{enrollment[student.id] ? 'Unenroll' : 'Enroll'}</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}

export default EnrollStudents;

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
        fontWeight: '700',
        color: PRIMARYCOLOR,
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    tableHeader: {
        flex: 1,
        fontWeight: '700',
        marginLeft:30
    },
    tableData: {
        flex: 1,
        marginHorizontal:10
    },
    enrollButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        backgroundColor: PRIMARYCOLOR,
        marginRight:10
    },
    enrollButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});
