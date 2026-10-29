import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const AdminRequestScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Administrative Requests</Text>

      <List.Accordion
        title="Lost And Found"
        style={styles.accordion}
        titleStyle={styles.accordionTitle}
      >
        <Button
          mode="contained"
          onPress={() => router.push('/admin_lofo')}
          style={styles.button}
        >
          See Lost Items of students
        </Button>

        <Button
          mode="contained"
          onPress={() => router.push('/admin_folo')}
          style={styles.button}
        >
          See What students found 
        </Button>
      </List.Accordion>

      <Button mode="outlined" onPress={() => router.push("/admindash")}>
          Back
        </Button>

    </View>
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
});

export default AdminRequestScreen;
