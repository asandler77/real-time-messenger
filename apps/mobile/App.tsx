import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import ChatScreen from './ChatScreen';
import LoginScreen from './LoginScreen';
import {type LoginResult} from './auth';
import {getAccessToken, saveAccessToken} from './authSessionStorage';
import {configurePushNotificationsAfterLogin} from './pushNotifications';

type CurrentUser = {
  userId: string;
  username: string;
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [historyReloadKey, setHistoryReloadKey] = useState(0);
  const accessTokenRef = useRef<string | null>(getAccessToken());
  const unsubscribePushRef = useRef<(() => void) | undefined>();

  useEffect(() => {
    return () => {
      unsubscribePushRef.current?.();
    };
  }, []);

  function handleLogin(result: LoginResult) {
    saveAccessToken(result.accessToken);
    accessTokenRef.current = result.accessToken;
    setCurrentUser({
      userId: result.userId,
      username: result.username,
    });
    unsubscribePushRef.current?.();
    void configurePushNotificationsAfterLogin(result.accessToken, {
      onNotificationTap: () => {
        setHistoryReloadKey(currentKey => currentKey + 1);
      },
    }).then(registration => {
      unsubscribePushRef.current = registration.unsubscribe;
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
          historyReloadKey={historyReloadKey}
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
