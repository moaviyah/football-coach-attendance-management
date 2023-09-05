import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors'
import { getDatabase, ref, onValue } from 'firebase/database'
import SeeDetails from './SeeDetails';
import { Ionicons } from '@expo/vector-icons';

const ManageStudents = ({ navigation }) => {
    const [students, setStudents] = useState([]);
    const [passingStudentData, setPassingStudentData] = useState();
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const db = getDatabase();

    useEffect(() => {
        const studentsRef = ref(db, 'students');
        onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const studentArray = Object.keys(data).map((key) => ({
                    uniqueId: key,
                    ...data[key],
                }));
                setStudents(studentArray);
            }
            setLoading(false)
        });
    }, []);

    const seeDetails = (student) => {
        setPassingStudentData(student);
        setDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setDetailsModalOpen(false);
    };

    return (
        <View style={styles.container}>
            {
                loading ?
                    (

                        <ActivityIndicator size="large" color={PRIMARYCOLOR} />

                    )
                    :
                    <View >
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => navigation.navigate('AddStudent')}
                            >
                                <Ionicons name="add-circle-outline" size={20} color={PRIMARYCOLOR} style={{ marginRight: 5 }} />
                                <Text style={styles.addButtonText}>Add Student</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.titleTxt}>Manage Students</Text>

                        <ScrollView style={styles.scrollView}>
                            {students.map((student) => (
                                <TouchableOpacity key={student.uniqueId} style={styles.card} onPress={() => seeDetails(student)}>
                                    <View>
                                        <Text style={styles.cardTitle}>ID# {student.uniqueId}</Text>
                                        <Text>Name: {student.name}</Text>
                                        <Text>Contact# {student.contact}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={PRIMARYCOLOR} style={styles.cardIcon} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Modal visible={detailsModalOpen}>
                            <SeeDetails closeModal={closeDetailsModal} student={passingStudentData} />
                        </Modal>
                    </View>
            }
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
    header: {
        flexDirection: 'row',
        paddingBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#ecf1ff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
    },
    addButtonText: {
        fontSize: 16,
        color: PRIMARYCOLOR,
        fontWeight: '600',
    },
    titleTxt: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    scrollView: {
        marginTop: 20,
    },
    card: {
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        elevation: 2, // Add a shadow effect
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontWeight: '600',
        fontSize: 16,
        color: PRIMARYCOLOR,
    },
    cardIcon: {
        marginLeft: 10,
    },
});

export default ManageStudents;
