import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, SectionList, Text, Modal } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../db/firestore';
import { useRouter } from 'expo-router';
import { DatePickerInput } from 'react-native-paper-dates';
import dayjs from 'dayjs'; 
import { enGB, registerTranslation } from 'react-native-paper-dates'

registerTranslation('en-GB', enGB);

type DropdownItem = {
  title: string;
  data: string[];
};

const RequestScreen = () => {
  const [degree, setDegree] = useState<string>(''); 
  const [firstDay, setFirstDay] = useState<Date | undefined>(undefined); 
  const [lastDay, setLastDay] = useState<Date | undefined>(undefined); 
  const [name, setName] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [isDegreeModalVisible, setDegreeModalVisible] = useState<boolean>(false);
  const [isYearModalVisible, setYearModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const handleSubmitRequest = async () => {
    if (!degree || !firstDay || !lastDay || !name || !year) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'leave-requests'), {
        degree,
        firstDay: dayjs(firstDay).format('DD-MM-YYYY'),
        lastDay: dayjs(lastDay).format('DD-MM-YYYY'),
        name,
        uid: auth.currentUser?.uid,
        year,
        status: 'pending',
        createdAt: serverTimestamp(),  // Automatically adds the current timestamp
      });
      Alert.alert('Success', 'Leave request submitted successfully!');
      router.back(); 
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const degreeData: DropdownItem[] = [
    { title: 'Degrees', data: ['BVOC-SD', 'BSC-IT'] },
  ];

  const yearData: DropdownItem[] = [
    { title: 'Years', data: ['FY', 'SY', 'TY'] },
  ];

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setDegreeModalVisible(false);
        setDegree(item);
      }}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderYearItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setYearModalVisible(false);
        setYear(item);
      }}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Make a Leave Request</Text>

      <Text style={styles.label}>Degree</Text>
      <TouchableOpacity onPress={() => setDegreeModalVisible(true)} style={styles.input}>
        <Text style={styles.inputText}>{degree || 'Select Degree'}</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isDegreeModalVisible}
        onRequestClose={() => setDegreeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <SectionList
            sections={degreeData}
            renderItem={renderItem}
            keyExtractor={(item, index) => item + index}
            style={styles.modalContent}
          />
        </View>
      </Modal>

      <Text style={styles.label}>First Day</Text>
      <DatePickerInput
        locale="en-GB"
        label="First Day"
        value={firstDay}
        onChange={(date) => setFirstDay(date)}
        inputMode="start"
        style={styles.input}
      />

      <Text style={styles.label}>Last Day</Text>
      <DatePickerInput
        locale="en-GB"
        label="Last Day"
        value={lastDay}
        onChange={(date) => setLastDay(date)}
        inputMode="end"
        style={styles.input}
      />

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Year</Text>
      <TouchableOpacity onPress={() => setYearModalVisible(true)} style={styles.input}>
        <Text style={styles.inputText}>{year || 'Select Year'}</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isYearModalVisible}
        onRequestClose={() => setYearModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <SectionList
            sections={yearData}
            renderItem={renderYearItem}
            keyExtractor={(item, index) => item + index}
            style={styles.modalContent}
          />
        </View>
      </Modal>

      <Button mode="contained" onPress={handleSubmitRequest} style={styles.button}>
        Submit
      </Button>
      <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
        Cancel
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    marginBottom: 12,
    padding: 15,
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
    color: '#333',
  },
});

export default RequestScreen;
