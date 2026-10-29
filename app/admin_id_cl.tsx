// Path: components/admin_id_cl.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Divider, Button } from 'react-native-paper';
import { getFirestore, collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../db/firestore';
import { useNavigation } from '@react-navigation/native';
import { TimePickerModal } from 'react-native-paper-dates'; // Only import TimePickerModal
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AdminIDCL = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<{ hours: number; minutes: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'id-card'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedRequests: any[] = [];
      querySnapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() });
      });

      setRequests(fetchedRequests);
      setLoading(false);
    }, (error) => {
      Alert.alert('Error', 'Failed to fetch requests.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const onConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setVisible(false);
      setSelectedTime({ hours, minutes });
    },
    []
  );

  const handleUpdateRequest = async () => {
    if (!selectedRequest || !selectedTime) {
      Alert.alert('Error', 'Please select a request and a collection time.');
      return;
    }

    try {
      const collectionTime = `${selectedTime.hours}:${selectedTime.minutes < 10 ? '0' : ''}${selectedTime.minutes}`;
      const docRef = doc(db, 'id-card', selectedRequest.id);
      await updateDoc(docRef, {
        status: 'Ready to Be Collected',
        collection_time: collectionTime,
      });

      Alert.alert('Success', 'Request updated successfully.');
      setSelectedRequest(null);
      setSelectedTime(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update the request.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Admin: ID-CARD COLLECTION</Text>

        {requests.map((request) => (
          <Card
            key={request.id}
            style={[styles.card, { borderColor: request.status === 'pending' ? '#F1C40F' : '#3498DB' }]}
            onPress={() => setSelectedRequest(request)}
          >
            <Card.Title title="ID-Card Collection" />
            <Card.Content>
              <Text style={styles.label}>Name:</Text>
              <Text>{request.name}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Degree:</Text>
              <Text>{request.degree}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Year:</Text>
              <Text>{request.year}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>UID:</Text>
              <Text>{request.ued}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Status:</Text>
              <Text>{request.status}</Text>
            </Card.Content>
          </Card>
        ))}

        {selectedRequest && (
          <>
            <Text style={styles.header}>Update Collection Time</Text>
            <Button onPress={() => setVisible(true)} mode="outlined">
              Pick Time
            </Button>
            <TimePickerModal
              visible={visible}
              onDismiss={onDismiss}
              onConfirm={onConfirm}
              hours={12} // Default hour
              minutes={0} // Default minute
              label="Select Time" // Added label for better UX
              uppercase={false} // Added to keep text as lowercase
            />

            <Button
              mode="contained"
              style={styles.button}
              onPress={handleUpdateRequest}
            >
              Update to "Ready to Be Collected"
            </Button>
          </>
        )}

        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton}>
          Back
        </Button>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginTop: 10,
  },
  divider: {
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3498DB',
  },
  backButton: {
    marginTop: 20,
  },
});

export default AdminIDCL;
