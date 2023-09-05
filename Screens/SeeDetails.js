import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { getDatabase, ref, remove, onValue } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const SeeDetails = ({ closeModal, student }) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(student.date);

    const deleteStudent = async () => {
        Alert.alert(
          'Confirm Deletion',
          `Are you sure you want to delete ${student.name}? Doing so will also remove the student from enrolled sessions.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  const db = getDatabase();
                  const studentRef = ref(db, `students/${student.uniqueId}`);
                  await remove(studentRef);
                  console.log(`Deleted student with ID ${student.uniqueId}`);
                  
                  // Fetch the list of sessions where the student is enrolled
                  const sessionsRef = ref(db, 'sessions');
                  onValue(sessionsRef, (snapshot) => {
                    const sessions = snapshot.val();
                    if (sessions) {
                      // Iterate through each session
                      for (const sessionId in sessions) {
                        const session = sessions[sessionId];
                        if (session.enrolled && session.enrolled[student.uniqueId] === true) {
                          // Remove the student from this session
                          const enrolledRef = ref(db, `sessions/${sessionId}/enrolled/${student.uniqueId}`);
                          remove(enrolledRef);
                          console.log(`Removed student from session ${sessionId}`);
                        }
                      }
                    }
                  });
                  
                  closeModal();
                } catch (error) {
                  console.error('Error deleting student:', error);
                }
              },
            },
          ]
        );
      };
      

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Student Details</Text>
            <View style={styles.detailsContainer}>
                <DetailItem iconName="ios-person" text={`Name: ${student.name}`} />
                <DetailItem iconName="ios-card" text={`ID: ${student.uniqueId}`} />
                <DetailItem iconName="ios-person" text={`Parent Name: ${student.parentName}`} />
                <DetailItem iconName="ios-call" text={`Contact: ${student.contact}`} />
                <DetailItem iconName="ios-warning" text={`Emergency: ${student.emergency}`} />
                <DetailItem iconName="ios-home" text={`Enrolled on: ${formattedDate}`} />
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteStudent}>
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Delete Student</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const DetailItem = ({ iconName, text  }) => (
    <View style={styles.detailItem}>
        <Ionicons name={iconName} size={24} color={PRIMARYCOLOR} style={styles.icon} />
        <Text style={styles.detailText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: BACKGROUNDCOLOR,
        paddingHorizontal: 15,
        paddingVertical: 30
    },
    header: {
        flexDirection: 'row',
        paddingBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: PRIMARYCOLOR,
        marginBottom: 20,
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
        margin: 5,
        borderWidth: 0.5,
        borderColor: 'grey'
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    detailText: {
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
});

export default SeeDetails;
