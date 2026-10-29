// Path: components/RailwayConcessionStatus.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Divider, Button } from 'react-native-paper';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../db/firestore';
import { useNavigation } from '@react-navigation/native';

const RailwayConcessionStatus = () => {
  const [formDetails, setFormDetails] = useState<any[]>([]);
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

    const userId = user.uid;
    const q = query(collection(db, 'railway-requests'), where('uid', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests: any[] = [];
      querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
      });
      
      if (requests.length > 0) {
        setFormDetails(requests);
      } else {
        Alert.alert('No Forms Found', 'You have not submitted any Railway Concession Requests.');
      }

      setLoading(false);
    }, (error) => {
      Alert.alert('Error', 'Failed to fetch form details.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (formDetails.length === 0) {
    return null; // Return null if no form details are available
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Railway Concession Form Status</Text>

      {formDetails.map((details) => {
        const isPending = details.status === 'pending';
        const borderColor = isPending ? '#F1C40F' : '#3498DB'; // Deep yellow for pending, blue for ready

        return (
          <Card key={details.id} style={[styles.card, { borderColor }]}>
            <Card.Title title="Railway Concession Form" />
            <Card.Content>
              <Text style={styles.label}>Name:</Text>
              <Text>{details.name}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Degree:</Text>
              <Text>{details.degree}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Year:</Text>
              <Text>{details.year}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Flat No/Floor/Building Name:</Text>
              <Text>{details.flatNo}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Address:</Text>
              <Text>{details.address}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Landmark:</Text>
              <Text>{details.landmark}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Pincode:</Text>
              <Text>{details.pincode}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Nearest Station:</Text>
              <Text>{details.nearestStation}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Coach Type:</Text>
              <Text>{details.coachType}</Text>

              <Divider style={styles.divider} />

              <Text style={styles.label}>Status:</Text>
              <Text>{isPending ? 'Pending' : 'Ready to be Collected'}</Text>

              {details.collection_time ? (
                <>
                  <Divider style={styles.divider} />
                  <Text style={styles.label}>Collection Time:</Text>
                  <Text>{details.collection_time}</Text>
                </>
              ) : null}
            </Card.Content>

            <Card.Actions>
              <Button mode="outlined" onPress={() => navigation.goBack()}>
                Back
              </Button>
            </Card.Actions>
          </Card>
        );
      })}
    </ScrollView>
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
});

export default RailwayConcessionStatus;
