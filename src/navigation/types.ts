import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type StudentTabParamList = {
  Home: undefined;
  AddEntry: undefined;
  History: undefined;
  Leaderboard: undefined;
};

export type SupervisorTabParamList = {
  Dashboard: undefined;
  Students: undefined;
  Leaderboard: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  StudentTabs: NavigatorScreenParams<StudentTabParamList>;
  SupervisorTabs: NavigatorScreenParams<SupervisorTabParamList>;
};
