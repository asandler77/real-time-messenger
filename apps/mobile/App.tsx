import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';

import ChatScreen from './ChatScreen';
import LoginScreen from './LoginScreen';
import {type LoginResult} from './auth';
import {getAccessToken, saveAccessToken} from './authSessionStorage';

type CurrentUser = {
  userId: string;
  username: string;
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const accessTokenRef = useRef<string | null>(getAccessToken());

  function handleLogin(result: LoginResult) {
    saveAccessToken(result.accessToken);
    accessTokenRef.current = result.accessToken;
    setCurrentUser({
      userId: result.userId,
      username: result.username,
    });
  }

  if (currentUser && accessTokenRef.current) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ChatScreen
          accessToken={accessTokenRef.current}
          currentUserId={currentUser.userId}
          currentUsername={currentUser.username}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LoginScreen onLogin={handleLogin} />
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
