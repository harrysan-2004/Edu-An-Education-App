import React, { useState, useEffect } from "react";
import { BottomNavigation, Text, useTheme, Button } from "react-native-paper";
import { router } from "expo-router"; // For routing
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../db/firestore'; // Ensure the correct path to your Firebase configuration file
import { View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const AdminDashboard = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "profile", title: "Profile", focusedicon: "account" }, // Icon added for profile
    { key: "leave", title: "Leave", icon: "clipboard-list" },
    { key: "requests", title: "Requests", icon: "email-outline" },
    { key: "lostfound", title: "Lost & Found", icon: "magnify" },
  ]);

  const [user, setUser] = useState<any>(null); // State to hold user data
  const auth = getAuth(app); // Initialize Firebase auth
  const theme = useTheme(); // Access theme for consistent styling

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // User is signed in
      } else {
        setUser(null); // User is signed out
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);

    // Navigate to different pages based on the selected tab
    switch (newIndex) {
      case 0:
        router.push("/admindash"); // Routes to profile.tsx
        break;
      case 1:
        router.push("/a_lr"); // Routes to leave.tsx
        break;
      case 2:
        router.push("/admin_ad_req"); // Routes to requests.tsx
        break;
      case 3:
        router.push("/a_lofo"); // Routes to lostfound.tsx
        break;
      default:
        break;
    }
  };

 
  // Function to navigate to account creation screen
  const handleCreateAccount = () => {
    router.push("/registration"); // Adjust the path to your create account screen
  };
 
  const handleLogOut = () => {
    auth.signOut()
      .then(() => {
        console.log('User signed out!');
        router.push("/login"); // Adjust the path to your login screen
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {user ? (
          <>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.info}>Email: {user.email}</Text>
            <Text style={styles.info}>UID: {user.uid}</Text>
          </>
        ) : (
          <Text style={styles.info}>No user is signed in.</Text>
        )}

       <Button 
          mode="contained" 
          onPress={handleCreateAccount} 
          style={styles.button}
        >
          Create Account
        </Button>

        <Button
        mode="contained"
        onPress={handleLogOut}
        style={styles.button}
      >
        Sign Out
      </Button>

      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleIndexChange}
        renderScene={() => null} // Using routing with expo-router
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f7f7f7",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: "#666",
  },
  button: {
    marginTop: 20,
    width: "80%",
  },
});

export default AdminDashboard;
