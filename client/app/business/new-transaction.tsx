import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { Button } from "react-native-paper";

const amounts = [100, 500, 1000];
const format = {
  date: (d: Date) => d.toLocaleDateString("en-GB"),
  time: (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
  currency: (n: number) => n.toLocaleString() + "₪",
};

export default () => {
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState({ date: false, time: false });
  const [editAmount, setEditAmount] = useState(false);

  const updateDate = (d?: Date) => d && setDate(d);
  const updateTime = (h: number, m: number) =>
    setDate(new Date(date.setHours(h, m)));

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-8">New Transaction</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-3 text-lg bg-gray-100 mb-6"
        value={desc}
        onChangeText={setDesc}
        placeholder="Description"
      />

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Return time and date</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShow({ ...show, date: true })}
          >
            <Text>{format.date(date)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShow({ ...show, time: true })}
          >
            <Text>{format.time(date)}</Text>
          </TouchableOpacity>
        </View>

        <DatePickerModal
          locale="en-GB"
          mode="single"
          visible={show.date}
          onDismiss={() => setShow({ ...show, date: false })}
          date={date}
          onConfirm={({ date }) => updateDate(date)}
        />

        <TimePickerModal
          visible={show.time}
          onDismiss={() => setShow({ ...show, time: false })}
          onConfirm={({ hours, minutes }) => updateTime(hours, minutes)}
          hours={date.getHours()}
          minutes={date.getMinutes()}
        />
      </View>

      <View className="mb-8">
        <Text className="text-lg font-semibold mb-3">SET AMOUNT</Text>
        <View className="flex-row items-center mb-4">
          <AmountBtn onPress={() => setAmount(Math.max(0, amount - 100))}>
            -
          </AmountBtn>
          <TouchableOpacity
            className="flex-1 items-center"
            onPress={() => setEditAmount(true)}
          >
            {editAmount ? (
              <TextInput
                className="text-2xl font-medium text-center"
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={(t) => setAmount(parseInt(t) || 0)}
                onBlur={() => setEditAmount(false)}
                autoFocus
              />
            ) : (
              <Text className="text-2xl font-medium">
                {format.currency(amount)}
              </Text>
            )}
          </TouchableOpacity>
          <AmountBtn onPress={() => setAmount(amount + 100)}>+</AmountBtn>
        </View>

        <View className="flex-row justify-between">
          {amounts.map((a) => (
            <TouchableOpacity
              key={a}
              className={`border-2 rounded-lg py-4 flex-1 mx-1 items-center ${
                amount === a
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-300 bg-white"
              }`}
              onPress={() => setAmount(a)}
            >
              <Text
                className={`text-lg ${
                  amount === a ? "text-white" : "text-gray-700"
                }`}
              >
                {format.currency(a)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        mode="contained"
        className="bg-blue-600 py-3 rounded-lg"
        onPress={() => console.log({ desc, amount, date })}
      >
        Continue
      </Button>
    </View>
  );
};

const AmountBtn = ({ onPress, children }: any) => (
  <TouchableOpacity
    className="border-2 border-gray-300 rounded-lg w-12 h-12 items-center justify-center"
    onPress={onPress}
  >
    <Text className="text-2xl">{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f3f4f6",
  },
});
