import { Alert, Pressable, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Screen from "@/components/Screen";
import { useRoute } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { Dish } from "@/types/types";

type Params = {
  date?: string;
  items?: string;
};

const Menu = () => {
  const [option, setOption] = useState("");
  const [type, setType] = useState("");
  const [item, setItem] = useState("");
  const [menuItems, setMenuItems] = useState<Dish[]>([]);

  const route = useRoute();
  const router = useRouter();
  const { date, items } = route.params as Params;

  const addDishToMenu = async () => {
    setItem("");
    const dish = {
      name: item,
      type,
      mealType: option,
    };
    const menu = {
      date,
      items: [dish],
    };
    const response = await axios.post(
      "http://localhost:3000/menu/addDish",
      menu,
    );

    const updatedMenuItems = [...menuItems, dish];
    setMenuItems(updatedMenuItems);

    console.log("dish add", response.data);
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
        router.back();
      }
    } catch (error) {
      Alert.alert("Failed to delete menu", "Error: " + error, [{ text: "OK" }]);
      console.error("Error", error);
    }
  };

  useEffect(() => {
    if (items) {
      const newItems: Dish[] = JSON.parse(items);
      setMenuItems(newItems);
    }
  }, [items]);

  return (
    <Screen>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          backgroundColor: "#fd5c63",
        }}
      >
        <Link href="/">
          <Text style={{ color: "white" }}>Back</Text>
        </Link>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {date}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            deletedMenu(date);
          }}
        >
          <Text style={{ color: "white" }}>Delete</Text>
        </Pressable>
      </View>

      <View
        style={{
          marginVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          alignSelf: "center",
        }}
      >
        <Pressable
          onPress={() => setOption("Breakfast")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 5,
            backgroundColor: option === "Breakfast" ? "#fd5c63" : "white",
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: option === "Breakfast" ? "white" : "black",
            }}
          >
            Breakfast
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setOption("Lunch")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 5,
            backgroundColor: option === "Lunch" ? "#fd5c63" : "white",
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: option === "Lunch" ? "white" : "black",
            }}
          >
            Lunch
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setOption("Dinner")}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 5,
            backgroundColor: option === "Dinner" ? "#fd5c63" : "white",
            borderRadius: 25,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: option === "Dinner" ? "white" : "black",
            }}
          >
            Dinner
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={[
          {
            backgroundColor: "white",
            borderRadius: 8,
            padding: 10,
            width: "100%",
            height: 80,
            marginVertical: 12,
          },
          menuItems && {
            height: "auto",
          },
          !menuItems && {
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
          {menuItems ? "Meal plan" : "There is no menu"}
        </Text>
        {menuItems && (
          <View>
            {menuItems?.some((item) => item.mealType === "Breakfast") && (
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
                {menuItems
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
            {menuItems?.some((item) => item.mealType === "Lunch") && (
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
                {menuItems
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
            {menuItems?.some((item) => item.mealType === "Dinner") && (
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
                {menuItems
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
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() => setType("Stable")}
          style={{
            backgroundColor: type === "Stable" ? "#e9967a" : "white",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: type === "Stable" ? "white" : "black",
            }}
          >
            Stable
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setType("Main")}
          style={{
            backgroundColor: type === "Main" ? "#e9967a" : "white",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: type === "Main" ? "white" : "black",
            }}
          >
            Main
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setType("Side")}
          style={{
            backgroundColor: type === "Side" ? "#e9967a" : "white",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: type === "Side" ? "white" : "black",
            }}
          >
            Side
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setType("Soup")}
          style={{
            backgroundColor: type === "Soup" ? "#e9967a" : "white",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: type === "Soup" ? "white" : "black",
            }}
          >
            Soup
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          marginTop: 15,
          marginHorizontal: 10,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <TextInput
          value={item}
          onChangeText={(text) => setItem(text)}
          style={{
            padding: 10,
            backgroundColor: "white",
            borderRadius: 6,
            flex: 1,
          }}
          placeholder="Dish name"
        />
        <Pressable
          onPress={addDishToMenu}
          style={{
            padding: 10,
            backgroundColor: "#fd5c63",
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              textAlign: "center",
              color: "white",
              width: 60,
            }}
          >
            Add
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
};

export default Menu;
