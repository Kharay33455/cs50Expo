import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const VideoPlayer = () => {
  return (
    <View style={styles.container}>
      <Video 
        source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }}

    style={styles.video}
        paused={false} // Set to true if you want to start with the video paused
        repeat={true} // Set to true if you want the video to loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%', // Adjust width as needed
    height: 300, // Adjust height as needed
  },
});

export default VideoPlayer;
