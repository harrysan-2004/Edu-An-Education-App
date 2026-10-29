import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../db/firestore";

const PostUploadScreen = () => {
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  // Pick image from the gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload image to Firebase Storage and return the download URL
  const uploadImageAsync = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `images/${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  // Handle the post upload
  const handleSubmit = async () => {
    if (!caption || !imageUri) {
      Alert.alert("Error", "Caption and image are required");
      return;
    }

    setIsUploading(true);
    try {
      // Upload the image to Firebase Storage
      const imageUrl = await uploadImageAsync(imageUri);

      // Add the post to Firestore
      await addDoc(collection(db, "posts"), {
        uid: auth.currentUser?.uid,
        caption,
        imageUrl,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Post uploaded successfully!");
      setCaption("");
      setImageUri(null);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write a caption"
        value={caption}
        onChangeText={setCaption}
      />
      <Button title="Pick an image" onPress={pickImage} />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      ) : (
        <Text>No image selected</Text>
      )}

      <Button
        title={isUploading ? "Uploading..." : "Upload Post"}
        onPress={handleSubmit}
        disabled={isUploading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
});

export default PostUploadScreen;
