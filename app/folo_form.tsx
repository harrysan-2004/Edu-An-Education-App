// Path: src/screens/LofoForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal, SectionList, TouchableOpacity, ScrollView, Text } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../db/firestore';
import { useRouter } from 'expo-router';

const LofoForm = () => {
  const [name, setName] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [whereLost, setWhereLost] = useState<string>('');
  const [isDegreeModalVisible, setDegreeModalVisible] = useState<boolean>(false);
  const [isYearModalVisible, setYearModalVisible] = useState<boolean>(false);
  const [isItemModalVisible, setItemModalVisible] = useState<boolean>(false);

  const router = useRouter();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const handleSubmitRequest = async () => {
    if (!name || !degree || !year || !item || !itemName || !itemDescription || !whereLost) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    Alert.alert(
      'Confirmation',
      'Are the details filled up properly?',
      [
        { text: 'No', onPress: () => console.log('Cancelled'), style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await addDoc(collection(db, 'folo'), {
                name,
                degree,
                year,
                item,
                itemName,
                itemDescription,
                whereLost,
                status: 'Lost', // Automatically sets the status to "Lost"
                timestamp: serverTimestamp(),
                whereCollect: '', // This field is set, but not used in the form
                uid: auth.currentUser?.uid,
              });
              Alert.alert('Success', 'Lost item report submitted successfully!');
              router.back();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
    );
  };

  const degreeData = [{ title: 'Degrees', data: ['BVOC-SD', 'BSC-IT'] }];
  const yearData = [{ title: 'Years', data: ['FY', 'SY', 'TY'] }];
  const itemData = [
    { title: 'Items', data: ['Smartphone', 'Laptop', 'Notebook', 'Airpods/EarPods', 'Cards', 'Keys', 'Speakers', 'Other'] },
  ];

  const renderItem = (item: string, setter: React.Dispatch<React.SetStateAction<string>>, closeModal: () => void) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setter(item);
        closeModal();
      }}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Lost Item Report</Text>

      <Divider style={styles.divider} />

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Degree</Text>
      <TouchableOpacity onPress={() => setDegreeModalVisible(true)} style={styles.selectInput}>
        <Text style={styles.inputText}>{degree || 'Select Degree'}</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={isDegreeModalVisible} onRequestClose={() => setDegreeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <SectionList
            sections={degreeData}
            renderItem={({ item }) => renderItem(item, setDegree, () => setDegreeModalVisible(false))}
            keyExtractor={(item, index) => item + index}
            style={styles.modalContent}
          />
        </View>
      </Modal>

      <Text style={styles.label}>Year</Text>
      <TouchableOpacity onPress={() => setYearModalVisible(true)} style={styles.selectInput}>
        <Text style={styles.inputText}>{year || 'Select Year'}</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={isYearModalVisible} onRequestClose={() => setYearModalVisible(false)}>
        <View style={styles.modalContainer}>
          <SectionList
            sections={yearData}
            renderItem={({ item }) => renderItem(item, setYear, () => setYearModalVisible(false))}
            keyExtractor={(item, index) => item + index}
            style={styles.modalContent}
          />
        </View>
      </Modal>

      <Text style={styles.label}>Item</Text>
      <TouchableOpacity onPress={() => setItemModalVisible(true)} style={styles.selectInput}>
        <Text style={styles.inputText}>{item || 'Select Item'}</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={isItemModalVisible} onRequestClose={() => setItemModalVisible(false)}>
        <View style={styles.modalContainer}>
          <SectionList
            sections={itemData}
            renderItem={({ item }) => renderItem(item, setItem, () => setItemModalVisible(false))}
            keyExtractor={(item, index) => item + index}
            style={styles.modalContent}
          />
        </View>
      </Modal>

      <TextInput
        label="Item Name"
        value={itemName}
        onChangeText={setItemName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Item Description"
        value={itemDescription}
        onChangeText={setItemDescription}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Where You Found The Lost Item"
        value={whereLost}
        onChangeText={setWhereLost}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSubmitRequest} style={styles.button}>
        Submit Report
      </Button>
      <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
        Cancel
      </Button>
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  selectInput: {
    marginBottom: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
  divider: {
    marginVertical: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '85%',
    maxHeight: '60%',
    padding: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
});

export default LofoForm;
