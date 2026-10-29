import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, List } from 'react-native-paper';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../db/firestore';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const LeaveRequestScreen = () => {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigation = useNavigation();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'leave-requests'), where('uid', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLeaveRequests(requests);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const renderRequestItem = (request: any) => (
    <List.Item
      key={request.id}
      title={`Degree: ${request.degree}`}
      description={`From: ${request.firstDay} To: ${request.lastDay}`}
      right={() => <Text style={styles.status}>{request.status.toUpperCase()}</Text>}
      style={[
        styles.requestItem,
        request.status === 'pending' ? styles.pending :
        request.status === 'accepted' ? styles.accepted :
        request.status === 'denied' ? styles.denied : null,
      ]}
    />
  );

  const pendingRequests = leaveRequests.filter((request) => request.status === 'pending');
  const acceptedRequests = leaveRequests.filter((request) => request.status === 'accepted');
  const deniedRequests = leaveRequests.filter((request) => request.status === 'denied');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Leave Requests</Text>

      {/* Pending Requests */}
      <List.Accordion
        title="Pending Requests"
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
        left={() => <List.Icon icon="clock" />}
      >
        {pendingRequests.length > 0 ? (
          pendingRequests.map(renderRequestItem)
        ) : (
          <Text style={styles.emptyText}>No pending requests</Text>
        )}
      </List.Accordion>

      {/* Accepted Requests */}
      <List.Accordion
        title="Accepted Requests"
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
        left={() => <List.Icon icon="check-circle" />}
      >
        {acceptedRequests.length > 0 ? (
          acceptedRequests.map(renderRequestItem)
        ) : (
          <Text style={styles.emptyText}>No accepted requests</Text>
        )}
      </List.Accordion>

      {/* Denied Requests */}
      <List.Accordion
        title="Denied Requests"
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
        left={() => <List.Icon icon="cancel" />}
      >
        {deniedRequests.length > 0 ? (
          deniedRequests.map(renderRequestItem)
        ) : (
          <Text style={styles.emptyText}>No denied requests</Text>
        )}
      </List.Accordion>

      <Button mode="contained" onPress={() => router.push("/RequestScreen")} style={styles.button}>
        Make a Request
      </Button>
      <Button mode="outlined" onPress={() => router.push("/studentprofile")}>
                Back
              </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  accordion: {
    elevation: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  accordionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  requestItem: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 10,
  },
  pending: {
    borderColor: '#FDD835',
    borderWidth: 2,
  },
  accepted: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  denied: {
    borderColor: '#F44336',
    borderWidth: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default LeaveRequestScreen;
