import React, { useState, useEffect } from "react";
import { View, ScrollView, Image, StyleSheet } from "react-native";
import { Text, Button, Card, IconButton, TextInput, FAB } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getFirestore, collection, onSnapshot, doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { app } from '../db/firestore'; // Adjust the path based on your project structure
import { router } from "expo-router";

// Define the type for a post
interface Post {
  id: string;
  name?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: string[];
}

const SocialMedia = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const db = getFirestore(app);

  // Fetch posts from Firebase Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(fetchedPosts);
    });

    return () => unsubscribe(); // Clean up listener on component unmount
  }, [db]);

  // Handle the like button
  const handleLike = async (postId: string) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: increment(1),
    });
  };

  // Handle adding a comment
  const handleAddComment = async (postId: string, newComment: string) => {
    if (newComment.trim() === "") return;

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      comments: arrayUnion(newComment),
    });
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {posts.map((post) => (
            <Card key={post.id} style={styles.card}>
              <Card.Title title={post.name || 'Unknown User'} />
              <Card.Content>
                <Image source={{ uri: post.imageUrl }} style={styles.image} />
                <Text style={styles.description}>{post.caption}</Text>
                <View style={styles.likeContainer}>
                  <IconButton
                    icon="thumb-up"
                    size={20}
                    onPress={() => handleLike(post.id)}
                  />
                  <Text>{post.likes} Likes</Text>
                </View>
                <View style={styles.commentsContainer}>
                  <Text style={styles.commentHeader}>Comments:</Text>
                  {post.comments?.map((comment: string, index: number) => (
                    <Text key={index} style={styles.commentText}>
                      - {comment}
                    </Text>
                  ))}
                  <AddComment onAdd={(comment) => handleAddComment(post.id, comment)} />
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Floating Action Button for creating a new post */}
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => {
            router.push("/PostUploadScreen");
          }}
        />
      </View>
    </SafeAreaProvider>
  );
};

// Component for adding a comment
interface AddCommentProps {
  onAdd: (comment: string) => void;
}

const AddComment: React.FC<AddCommentProps> = ({ onAdd }) => {
  const [comment, setComment] = useState<string>("");

  const handleAdd = () => {
    if (comment.trim() !== "") {
      onAdd(comment);
      setComment("");
    }
  };

  return (
    <View style={styles.addCommentContainer}>
      <TextInput
        mode="outlined"
        placeholder="Add a comment"
        value={comment}
        onChangeText={setComment}
        style={styles.commentInput}
      />
      <Button mode="contained" onPress={handleAdd}>
        Add Comment
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  commentsContainer: {
    marginTop: 16,
  },
  commentHeader: {
    fontWeight: "bold",
  },
  commentText: {
    marginBottom: 4,
  },
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    marginRight: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default SocialMedia;
