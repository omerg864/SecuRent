import { View, StyleSheet } from "react-native";
import { Route, useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ParallaxScrollView from "@/components/ui/ParallaxScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import AccountButton from "@/components/AccountButton";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const BusinessSetupSteps = [
  {
    id: "email",
    title: "Verify your email address",
    subTitle: "Confirm your email to secure your account",
    icon: <MaterialCommunityIcons name="email-check" size={42} color="white" />,
    route: "/verify-email",
  },
  {
    id: "bank",
    title: "Add Bank Details",
    subTitle: "Link your bank account for transactions",
    icon: <MaterialIcons name="account-balance" size={42} color="white" />,
    route: "/bank-details",
  },
  {
    id: "verification",
    title: "Business Verification",
    subTitle: "Complete verification to activate your business account",
    icon: <Entypo name="briefcase" size={42} color="white" />,
    route: "/verification",
  },
];

export default function BusinessSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Retrieve query params
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Load completed steps from AsyncStorage
  useEffect(() => {
    const loadCompletedSteps = async () => {
      const savedSteps = await AsyncStorage.getItem("completedSteps");
      if (savedSteps) {
        setCompletedSteps(JSON.parse(savedSteps));
      }
    };
    loadCompletedSteps();
  }, []);

  // Check if a step was just completed and update state
  useEffect(() => {
    if (params.verifiedBusiness === "true") {
      handleStepCompletion("verification"); // Mark verification as completed
    }
    if (params.verifiedEmail === "true") {
      handleStepCompletion("email");
    }
    if (params.addedBank === "true") {
      handleStepCompletion("bank");
    }
  }, [params]);

  // Handle step completion
  const handleStepCompletion = async (id: string) => {
    if (!completedSteps.includes(id)) {
      const updatedSteps = [...completedSteps, id];
      await AsyncStorage.setItem(
        "completedSteps",
        JSON.stringify(updatedSteps)
      );
      setCompletedSteps(updatedSteps);
    }
  };

  // Remaining steps
  const remainingSteps = BusinessSetupSteps.filter(
    (step) => !completedSteps.includes(step.id)
  );

  // If all steps are complete, navigate to business home
  useFocusEffect(
    useCallback(() => {
      if (remainingSteps.length === 0) {
        router.replace("/business/business-home");
      }
    }, [remainingSteps.length])
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <MaterialCommunityIcons
          name="clipboard-check-outline"
          size={250}
          color="#808080"
          style={styles.headerImage}
        />
      }
    >
      <View className="px-6 pt-8">
        <ThemedText className="text-3xl font-bold text-white">
          Business Setup
        </ThemedText>
        <ThemedText className="text-lg text-indigo-200 mt-1">
          Complete these steps to activate your business account
        </ThemedText>

        <View className="space-y-4 mt-8 flex-col gap-4">
          {remainingSteps.map((step) => (
            <AccountButton
              key={step.id}
              handlePress={() => router.replace(step.route as Route)}
              title={step.title}
              subTitle={step.subTitle}
              Icon={step.icon}
            />
          ))}
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
});
