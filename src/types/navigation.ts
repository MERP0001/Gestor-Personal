import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Transactions: undefined;
  AddTransaction: undefined;
  Statistics: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 