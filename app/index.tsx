import { ActivityIndicator, Button, Text, View } from "react-native";
import { useAuth } from "@/context/auth";
import LoginForm from "./components/LoginForm";
import { BASE_URL } from "@/constants";
import { useState } from "react";

export default function Index() {
  const { user, isLoading, signOut, fetchWithAuth } = useAuth();
  const [data, setData] = useState<any>(null);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{JSON.stringify(user, null, 2)}</Text>

      <Button title="Sign out" onPress={signOut} />
      <Text>{JSON.stringify(data, null, 2)}</Text>
      <Button
        title="Fetch data"
        onPress={async () => {
          const res = await fetchWithAuth(`${BASE_URL}/api/protected/data`, {
            method: "GET",
          });
          setData(await res.json());
        }}
      />
    </View>
  );
}
