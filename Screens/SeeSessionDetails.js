import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native';
import { BACKGROUNDCOLOR, PRIMARYCOLOR } from '../colors';
import { format } from 'date-fns';
import { getDatabase, ref, remove } from 'firebase/database';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const SeeSessionDetails = ({navigation}) => {
    const route = useRoute();
    const { session } = route.params;
    return (
        <View style={{backgroundColor:BACKGROUNDCOLOR, flex:1}}>
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
                <Ionicons name="chevron-back" size={30} color={PRIMARYCOLOR} />
            </TouchableOpacity>
            <Text style={styles.titleTxt}>Session Details</Text>

            <View style={styles.sessionInfo}>
                <InfoField icon="person-outline" label="Coach:" text={session.coachName} />
                <InfoField icon="bookmark-outline" label="Session Name:" text={session.sessionName} />
                <InfoField icon="calendar-outline" label="Start Date:" text={format(new Date(session.startDate), 'dd MMMM yyyy')} />
                <InfoField icon="calendar-outline" label="End Date:" text={format(new Date(session.endDate), 'dd MMMM yyyy')} />
                <InfoField icon="call-outline" label="Coach's Contact:" text={session.coachContact} />
            </View>

        </SafeAreaView>
        </View>
    );
};

const InfoField = ({ icon, label, text }) => (
    <View style={styles.infoField}>
        <Ionicons name={icon} size={24} color={PRIMARYCOLOR} />
        <Text style={styles.infoText}>{label}</Text>
        <Text style={styles.infoTextRight}>{text}</Text>
    </View>
);

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
    sessionInfo: {
        marginTop: 30,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    infoField: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    enrollButton: {
        backgroundColor: PRIMARYCOLOR,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    infoTextRight: {
        fontSize: 16,
        marginLeft: 10,
        textAlign: 'right',
        flex: 1,
        fontWeight: '600',
    },
});

export default SeeSessionDetails;
