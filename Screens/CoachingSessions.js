import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet, Image } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import Sessiondetails from './Sessiondetails';
import { format } from 'date-fns'; // Import the format function
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const CoachingSessions = ({ navigation }) => {
    const [sessions, setSessions] = useState([]);
    const [passingSessionData, setPassingSessionData] = useState();
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const db = getDatabase();

    useEffect(() => {
        const sessionsRef = ref(db, 'sessions');
        onValue(sessionsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const sessionArray = Object.keys(data).map((key) => ({
                    uniqueId: key,
                    ...data[key],
                }));
                setSessions(sessionArray);
            }
        });
    }, []);

    const seeDetails = (session) => {
        setPassingSessionData(session);
        setDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setDetailsModalOpen(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('CreateSession')}
                >
                    <Ionicons name="add-circle-outline" size={20} color={PRIMARYCOLOR} style={{ marginRight: 5 }} />
                    <Text style={styles.addButtonLabel}>Create Session</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.titleTxt}>Manage Sessions</Text>
            <ScrollView>
                {sessions?.map((session) => (
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
            <Modal visible={detailsModalOpen}>
                <Sessiondetails closeModal={closeDetailsModal} session={passingSessionData} />
            </Modal>
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
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonLabel: {
        fontSize: 16,
        color: PRIMARYCOLOR,
        fontWeight: '600',
        marginLeft: 5,
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

export default CoachingSessions;
