// Path: src/screens/AdminRequestScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, List, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { getFirestore, collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../db/firestore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AdminRequestScreen = () => {
  const [userItems, setUserItems] = useState<any[]>([]);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserItems = () => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const q = query(collection(db, 'lofo'), where('uid', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setUserItems(items);
      }, (error) => {
        Alert.alert('Error', 'Failed to fetch your items.');
      });

      return () => unsubscribe();
    };

    fetchUserItems();
  }, []);

  const handleStatusChange = async (itemId: string) => {
    try {
      const itemDoc = doc(db, 'lofo', itemId);
      await updateDoc(itemDoc, {
        status: 'Found',
      });
      Alert.alert('Success', 'Item status updated to "Found".');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update item status: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaProvider>
        <Text style={styles.header}>Lost And Found</Text>

        <List.Accordion
          title="Lost and Found Forms"
          style={styles.accordion}
          titleStyle={styles.accordionTitle}
        >
          <Button
            mode="contained"
            onPress={() => router.push('/lofo_form')}
            style={styles.button}
          >
            Lost An Item
          </Button>

          <Button
            mode="contained"
            onPress={() => router.push('/folo_form')}
            style={styles.button}
          >
            Found Someone's Lost Item
          </Button>
        </List.Accordion>

        <List.Accordion
          title="Status of Your Lost Item"
          style={styles.accordion}
          titleStyle={styles.accordionTitle}
        >
          {userItems.map((item) => {
            const isLost = item.status === 'Lost';
            return (
              <Card key={item.id} style={[styles.card, { borderColor: isLost ? '#E1341E' : '#1ECBE1' }]}>
                <Card.Content>
                  <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
                  <Text style={styles.itemText}>Status: {item.status}</Text>
                  <Text style={styles.itemText}>Where to Collect: {item.whereCollect || 'Not Set'}</Text>
                </Card.Content>
                {isLost && (
                  <Card.Actions>
                    <Button mode="contained" onPress={() => handleStatusChange(item.id)} style={styles.statusButton}>
                      Mark as Found
                    </Button>
                  </Card.Actions>
                )}
              </Card>
            );
          })}
        </List.Accordion>
        <Button mode="outlined" onPress={() => router.push("/studentprofile")}>
                Back
              </Button>
      </SafeAreaProvider>
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
    marginBottom: 10,
  },
  accordionTitle: {
    fontSize: 18,
  },
  button: {
    marginTop: 10,
  },
  card: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  statusButton: {
    marginTop: 10,
    backgroundColor: '#1ECBE1',
  },
});

export default AdminRequestScreen;
