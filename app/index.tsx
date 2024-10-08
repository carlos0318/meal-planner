import Screen from "@/components/Screen";
import { Pressable, ScrollView, Text, View, Alert } from "react-native";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Menu } from "@/types/types";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { BottomModal, ModalContent, ModalTitle } from "react-native-modals";
import { ModalPortal } from "react-native-modals";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function Index() {
  const currentDate = moment();
  const startOfWeek = currentDate.clone().startOf("week");
  const [date, setDate] = useState<Date>(new Date());
  const [dateToCopy, setDateToCopy] = useState<Date>();
  const [modalVisible, setModalVisible] = useState(false);
  const [menuData, setMenuData] = useState<Menu[]>([]);
  const router = useRouter();

  const fetchAllData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/menu/all");
      setMenuData(response?.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const deletedMenu = async (date: string | undefined) => {
    try {
      console.log("Date: ", date);
      if (date) {
        await axios.delete("http://localhost:3000/menu/deleteByDate", {
          params: { date },
        });
        Alert.alert(
          "Successful elimination",
          "The menu has been successfully deleted",
          [{ text: "OK" }],
        );
        fetchAllData();
      }
    } catch (error) {
      Alert.alert("Failed to delete menu", "Error: " + error, [{ text: "OK" }]);
      console.error("Error", error);
    }
  };

  const handlecopymenu = async () => {
    try {
      if (date && dateToCopy) {
        await axios.post("http://localhost:3000/menu/copyByDate", {
          fromDate: dateToCopy,
          toDate: moment(date).format("ddd DD"),
        });
        fetchAllData();
        setModalVisible(false);
        Alert.alert("The date was copied correctly");
      } else {
        Alert.alert("No date to be copied", "", [{ text: "OK" }]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Aqu� estamos seguros de que error tiene una propiedad `response`
        Alert.alert(
          "Failed to copy menu",
          "Error: " + error?.response?.data?.error ||
            "An unexpected error occurred",
          [{ text: "OK" }],
        );
      } else {
        // Manejar otros tipos de errores (no-Axios)
        Alert.alert("Failed to copy menu", "An unexpected error occurred", [
          { text: "OK" },
        ]);
      }
    }
  };

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, []),
  );

  const renderWeekDates = (startOfWeek: moment.Moment) => {
    let weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = startOfWeek.clone().add(i, "days");
      const formattedDate = date.format("ddd DD");

      const menuForDate = menuData.find((menu) => menu.date === formattedDate);

      const isCurrentDate = date.isSame(currentDate, "day");

      weekDates.push(
        <View
          key={i}
          style={{
            flexDirection: "row",
            gap: 12,
            marginVertical: 10,
          }}
        >
          <View
            style={[
              {
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "white",
                marginVertical: 10,
                justifyContent: "center",
                alignItems: "center",
              },
              isCurrentDate && { backgroundColor: "black" },
            ]}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: isCurrentDate ? "white" : "black",
              }}
            >
              {date.format("DD")}
            </Text>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: isCurrentDate ? "white" : "black",
              }}
            >
              {date.format("ddd")}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              const items = menuForDate?.items;

              router.push({
                pathname: "/menu",
                params: { date: formattedDate, items: JSON.stringify(items) },
              });
            }}
            style={[
              {
                backgroundColor: "white",
                borderRadius: 8,
                padding: 10,
                width: "85%",
              },
              menuForDate && {
                height: "auto",
              },
              !menuForDate && {
                height: 80,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: "600",
                color: "gray",
              }}
            >
              {menuForDate ? "Meal plan" : "There is no menu"}
            </Text>
            {menuForDate && (
              <View>
                {menuForDate?.items.some(
                  (item) => item.mealType === "Breakfast",
                ) && (
                  <View>
                    <View
                      style={{
                        backgroundColor: "#e0e0e0",
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        marginVertical: 5,
                        width: 100,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 13,
                          textAlign: "center",
                        }}
                      >
                        Breakfast
                      </Text>
                    </View>
                    {menuForDate.items
                      .filter((item) => item.mealType === "Breakfast")
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                            marginVertical: 4,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#fd5c63",
                              paddingHorizontal: 7,
                              paddingVertical: 4,
                              borderRadius: 20,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                textAlign: "center",
                                color: "white",
                              }}
                            >
                              {item.type}
                            </Text>
                          </View>
                          <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                        </View>
                      ))}
                  </View>
                )}
                {menuForDate?.items.some(
                  (item) => item.mealType === "Lunch",
                ) && (
                  <View>
                    <View
                      style={{
                        backgroundColor: "#e0e0e0",
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        marginVertical: 5,
                        width: 100,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 13,
                          textAlign: "center",
                        }}
                      >
                        Lunch
                      </Text>
                    </View>
                    {menuForDate.items
                      .filter((item) => item.mealType === "Lunch")
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                            marginVertical: 4,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#fd5c63",
                              paddingHorizontal: 7,
                              paddingVertical: 4,
                              borderRadius: 20,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                textAlign: "center",
                                color: "white",
                              }}
                            >
                              {item.type}
                            </Text>
                          </View>
                          <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                        </View>
                      ))}
                  </View>
                )}
                {menuForDate?.items.some(
                  (item) => item.mealType === "Dinner",
                ) && (
                  <View>
                    <View
                      style={{
                        backgroundColor: "#e0e0e0",
                        paddingHorizontal: 12,
                        paddingVertical: 3,
                        marginVertical: 5,
                        width: 100,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 13,
                          textAlign: "center",
                        }}
                      >
                        Dinner
                      </Text>
                    </View>
                    {menuForDate.items
                      .filter((item) => item.mealType === "Dinner")
                      .map((item, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                            marginVertical: 4,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#fd5c63",
                              paddingHorizontal: 7,
                              paddingVertical: 4,
                              borderRadius: 20,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 11,
                                textAlign: "center",
                                color: "white",
                              }}
                            >
                              {item.type}
                            </Text>
                          </View>
                          <Text style={{ fontWeight: "500" }}>{item.name}</Text>
                        </View>
                      ))}
                  </View>
                )}
              </View>
            )}
            <Pressable
              onPress={() => {
                setModalVisible(true);
                setDateToCopy(menuForDate?.date);
              }}
              style={{ position: "absolute", bottom: 5, right: 60 }}
            >
              <Text style={{ fontSize: 10, fontWeight: "500", color: "gray" }}>
                Copy
              </Text>
            </Pressable>
            <Pressable
              onPress={() => deletedMenu(menuForDate?.date)}
              style={{ position: "absolute", bottom: 5, right: 10 }}
            >
              <Text style={{ fontSize: 10, fontWeight: "500", color: "gray" }}>
                Deleted
              </Text>
            </Pressable>
          </Pressable>
        </View>,
      );
    }

    return weekDates;
  };

  const renderWeeks = (numWeeks: number) => {
    let weeks: React.ReactNode[] = [];
    for (let i = 0; i < numWeeks; i++) {
      weeks.push(
        <View key={i}>
          <Text>
            {startOfWeek
              .clone()
              .add(i * 7, "days")
              .format("DD MMM")}
          </Text>
          <Text>{renderWeekDates(startOfWeek.clone().add(i * 7, "days"))}</Text>
        </View>,
      );
    }

    return weeks;
  };

  return (
    <>
      <Screen>
        <ScrollView>
          <View
            style={{
              flex: 1,
              padding: 12,
            }}
          >
            {renderWeeks(3)}
          </View>
        </ScrollView>
      </Screen>
      <BottomModal
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(false)}
        onSwipeOut={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        height={0.3}
        width={1}
        modalTitle={<ModalTitle title="Copy menu to a date" hasTitleBar />}
      >
        <ModalContent
          style={{
            flex: 1,
            backgroundColor: "fff",
          }}
        >
          <Text style={{ marginVertical: 20, textAlign: "center" }}>
            Select the menu to which the menu is to be copied.
          </Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            onChange={onChange}
            style={{ marginHorizontal: "auto" }}
          />
          <Pressable
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              marginHorizontal: "auto",
              marginVertical: 20,
              backgroundColor: "#fd5c63",
              borderRadius: 999,
            }}
            onPress={handlecopymenu}
          >
            <Text style={{ color: "#fff" }}>Copy</Text>
          </Pressable>
        </ModalContent>
      </BottomModal>
      <ModalPortal />
    </>
  );
}
