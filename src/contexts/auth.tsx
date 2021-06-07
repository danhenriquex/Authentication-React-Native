import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState, useContext } from "react";
import api from "../services/api";
import * as auth from "../services/Auth";
import { View, ActivityIndicator } from "react-native";

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await AsyncStorage.getItem("@RNAuth:user");
      const storageToken = await AsyncStorage.getItem("@RNAuth:token");

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (storageUser && storageToken) {
        api.defaults.headers["Authorization"] = `Bearer ${storageToken}`;

        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);

    api.defaults.headers["Authorization"] = `Bearer ${response.token}`; // ! Envia automaticamente um header, com o conteúdo bearer(token) para o back.

    await AsyncStorage.setItem("@RNAuth:user", JSON.stringify(response.user)); // ! * Pode usar o localStorage pois é mais rapido
    await AsyncStorage.setItem("@RNAuth:token", response.token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
