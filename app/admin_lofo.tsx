// Path: src/screens/admin_lofo.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Text, Button, List, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { getFirestore, collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { app } from '../db/firestore';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AdminLofoScreen = () => {
  const [allItems, setAllItems] = useState<any[]>([]);
  const [whereCollect, setWhereCollect] = useState<string>('');
  const db = getFirestore(app);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAllItems = () => {
      const q = query(collection(db, 'lofo'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setAllItems(items);
      }, (error) => {
        Alert.alert('Error', 'Failed to fetch items.');
      });

      return () => unsubscribe();
    };

    fetchAllItems();
  }, []);

  const handleStatusChange = async (itemId: string) => {
    try {
      const itemDoc = doc(db, 'lofo', itemId);
      await updateDoc(itemDoc, {
        status: 'Found',
        whereCollect: whereCollect || 'Not Set',
      });
      Alert.alert('Success', 'Item status updated to "Found" and collection point set.');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update item: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaProvider>
        <Text style={styles.header}>Admin Lost And Found</Text>

        <List.Accordion
          title="Lost Items"
          style={styles.accordion}
          titleStyle={styles.accordionTitle}
        >
          {allItems
            .filter((item) => item.status === 'Lost')
            .map((item) => (
              <Card key={item.id} style={[styles.card, { borderColor: '#E1341E' }]}>
                <Card.Content>
                  <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
                  <Text style={styles.itemText}>Status: {item.status}</Text>
                  <Text style={styles.itemText}>Where to Collect: {item.whereCollect || 'Not Set'}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter collection point"
                    value={whereCollect}
                    onChangeText={setWhereCollect}
                  />
                </Card.Content>
                <Card.Actions>
                  <Button mode="contained" onPress={() => handleStatusChange(item.id)} style={styles.statusButton}>
                    Mark as Found
                  </Button>
                </Card.Actions>
              </Card>
            ))}
        </List.Accordion>

        <List.Accordion
          title="Found Items"
          style={styles.accordion}
          titleStyle={styles.accordionTitle}
        >
          {allItems
            .filter((item) => item.status === 'Found')
            .map((item) => (
              <Card key={item.id} style={[styles.card, { borderColor: '#1ECBE1' }]}>
                <Card.Content>
                  <Text style={styles.itemText}>Item Name: {item.itemName}</Text>
                  <Text style={styles.itemText}>Status: {item.status}</Text>
                  <Text style={styles.itemText}>Where to Collect: {item.whereCollect || 'Not Set'}</Text>
                </Card.Content>
              </Card>
            ))}
        </List.Accordion>

        <Button mode="outlined" onPress={() => router.push("/admindash")}>
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
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  statusButton: {
    marginTop: 10,
    backgroundColor: '#1ECBE1',
  },
});

export default AdminLofoScreen;
