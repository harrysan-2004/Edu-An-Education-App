import React, { useState } from 'react';
import { View, StyleSheet, Alert, Modal, SectionList, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../db/firestore';
import { ScrollView } from 'react-native';

const RegistrationPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [classType, setClassType] = useState<string>('');
  const [isYearModalVisible, setYearModalVisible] = useState<boolean>(false);
  const [isClassModalVisible, setClassModalVisible] = useState<boolean>(false);

  const db = getFirestore(app);
  const auth = getAuth(app);

  const yearData = [{ title: 'Years', data: ['FY', 'SY', 'TY'] }];
  const classData = [{ title: 'Classes', data: ['BVOC-SD', 'BSC-IT', 'Department of SD and IT'] }];

  const handleRegister = async () => {
    if (!email || !password || !name || !year || !classType) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user details in the Firestore 'users' collection
      await addDoc(collection(db, 'users'), {
        uid: user.uid, // Store the UID
        email,
        name,
        year,
        classType,
        createdAt: new Date(),
      });

      Alert.alert('Success', `Account created for ${user.email}`);
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    }
  };

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
      <Text style={styles.header}>Create Your Account</Text>

      <Divider style={styles.divider} />

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Year</Text>
      <TouchableOpacity onPress={() => setYearModalVisible(true)} style={styles.selectInput}>
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
            renderItem={({ item }) => renderItem(item, setYear, () => setYearModalVisible(false))}
            keyExtractor={(item, index) => item + index}
            style={styles.modalContent}
          />
        </View>
      </Modal>

      <Text style={styles.label}>Class</Text>
      <TouchableOpacity onPress={() => setClassModalVisible(true)} style={styles.selectInput}>
        <Text style={styles.inputText}>{classType || 'Select Class'}</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isClassModalVisible}
        onRequestClose={() => setClassModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <SectionList
            sections={classData}
            renderItem={({ item }) => renderItem(item, setClassType, () => setClassModalVisible(false))}
            keyExtractor={(item, index) => item + index}
            style={styles.modalContent}
          />
        </View>
      </Modal>

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
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

export default RegistrationPage;
