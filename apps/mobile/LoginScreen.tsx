import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {login, type LoginResult} from './auth';

type LoginScreenProps = {
  onLogin: (result: LoginResult) => void;
};

function LoginScreen({onLogin}: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setIsLoading(true);

    try {
      const accessToken = await login({username, password});
      onLogin(accessToken);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Login failed. Try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container} testID="login-screen">
      <Text style={styles.title}>Real-time Messenger</Text>
      <Text style={styles.subtitle}>Sign in with your demo account.</Text>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isLoading}
        onChangeText={setUsername}
        placeholder="Username"
        style={styles.input}
        testID="username-input"
        value={username}
      />
      <TextInput
        editable={!isLoading}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        testID="password-input"
        value={password}
      />

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        disabled={isLoading}
        onPress={handleLogin}
        style={({pressed}) => [
          styles.button,
          isLoading ? styles.buttonDisabled : null,
          pressed ? styles.buttonPressed : null,
        ]}
        testID="login-button">
        {isLoading ? (
          <ActivityIndicator color="#ffffff" testID="login-loading" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#4b5563',
    fontSize: 16,
    marginBottom: 32,
    marginTop: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderRadius: 10,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    color: '#b91c1c',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 10,
    marginTop: 8,
    paddingVertical: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LoginScreen;
