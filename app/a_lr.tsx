import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import { Text, Button, Card, ActivityIndicator, List } from 'react-native-paper';
import { getFirestore, collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { app } from '../db/firestore';
import { router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AdminLeaveRequestScreen = () => {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchLeaveRequests = () => {
      const q = query(collection(db, 'leave-requests'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const requests = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setLeaveRequests(requests);
            setLoading(false);
          } else {
            setLoading(false);
            console.log('No leave requests found');
          }
        },
        (error) => {
          setLoading(false);
          console.error('Error fetching leave requests:', error);
          Alert.alert('Error', 'Failed to retrieve leave requests. Please try again later.');
        }
      );

      return unsubscribe;
    };

    const unsubscribe = fetchLeaveRequests();

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'accepted' | 'denied') => {
    try {
      const requestDoc = doc(db, 'leave-requests', id);
      await updateDoc(requestDoc, { status });
      Alert.alert('Success', `Request ${status}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const filterRequests = (status: string) => leaveRequests.filter((request) => request.status === status);

  const renderItem = ({ item }: { item: any }) => (
    <Card
      style={[
        styles.requestItem,
        item.status === 'pending'
          ? styles.pending
          : item.status === 'accepted'
          ? styles.accepted
          : item.status === 'denied'
          ? styles.denied
          : null,
      ]}
    >
      <Card.Content>
        <List.Accordion
          title={`Name: ${item.name}`}
          titleStyle={styles.accordionTitle}
          style={styles.accordion}
        >
          <View style={styles.accordionContent}>
            <Text style={styles.requestText}>Degree: {item.degree}</Text>
            <Text style={styles.requestText}>Year: {item.year}</Text>
            <Text style={styles.requestText}>First Day: {item.firstDay}</Text>
            <Text style={styles.requestText}>Last Day: {item.lastDay}</Text>
            <Text style={styles.requestText}>Status: {item.status}</Text>

            {item.status === 'pending' && (
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={() => handleUpdateStatus(item.id, 'accepted')}
                  style={styles.actionButton}
                >
                  Accept
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleUpdateStatus(item.id, 'denied')}
                  style={styles.actionButton}
                >
                  Deny
                </Button>
              </View>
            )}
          </View>
        </List.Accordion>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading leave requests...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
    <ScrollView style={styles.container}>
      
      <Text style={styles.header}>Student Leave Requests</Text>
      
      <Text style={styles.subHeader}>Pending Requests</Text>
      <FlatList
        data={filterRequests('pending')}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No pending requests</Text>
        )}
      />

      <Text style={styles.subHeader}>Accepted Requests</Text>
      <FlatList
        data={filterRequests('accepted')}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No accepted requests</Text>
        )}
      />

      <Text style={styles.subHeader}>Denied Requests</Text>
      <FlatList
        data={filterRequests('denied')}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No denied requests</Text>
        )}
      />

<Button mode="outlined" onPress={() => router.push("/admindash")}>
          Back
        </Button>
        
    </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom:25,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  requestItem: {
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 4, // Elevation for shadow effect
  },
  accordion: {
    borderRadius: 4,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 16,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
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
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#999',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#999',
  },
});

export default AdminLeaveRequestScreen;
