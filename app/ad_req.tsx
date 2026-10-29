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
        title="Railway Concession"
        style={styles.accordion}
        titleStyle={styles.accordionTitle}
      >
        <Button
          mode="contained"
          onPress={() => router.push('/rc_cf')}
          style={styles.button}
        >
          Request Form
        </Button>

        <Button
          mode="contained"
          onPress={() => router.push('/view_rc_sf')}
          style={styles.button}
        >
          See Form Status
        </Button>
      </List.Accordion>

      <List.Accordion
        title="ID-Card Collection Request"
        style={styles.accordion}
        titleStyle={styles.accordionTitle}
      >
        <Button
          mode="contained"
          onPress={() => router.push('/id_cl')}
          style={styles.button}
        >
          Request Form for ID Collection
        </Button>

        <Button
          mode="contained"
          onPress={() => router.push('/view_id_cl')}
          style={styles.button}
        >
          View Status for ID Collection
        </Button>
      </List.Accordion>

      <List.Accordion
        title="Marksheet Collection"
        style={styles.accordion}
        titleStyle={styles.accordionTitle}
      >
        <Button
          mode="contained"
          onPress={() => router.push('/mks_cl')}
          style={styles.button}
        >
          Request Form for Marksheet Collection
        </Button>

        <Button
          mode="contained"
          onPress={() => router.push('/view_mks_cl')}
          style={styles.button}
        >
          See Status
        </Button>
      </List.Accordion>
      <Button mode="outlined" onPress={() => router.push("/studentprofile")}>
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
