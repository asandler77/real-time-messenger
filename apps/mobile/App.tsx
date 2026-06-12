import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import React, {useState} from 'react';

import ChatScreen from './ChatScreen';
import LoginScreen from './LoginScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [accessToken, setAccessToken] = useState<string | null>(null);

  if (accessToken) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ChatScreen accessToken={accessToken} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LoginScreen onLogin={setAccessToken} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f8fb',
    paddingTop: 48,
  },
});

export default App;
