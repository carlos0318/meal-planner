export interface Dish {
  name: string;
  type: string;
  mealType: string;
}

export interface Menu {
  date: string;
  items: Dish[];
}
