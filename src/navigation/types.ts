import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  /** Shown after registration or when login returns PENDING_APPROVAL */
  PendingApproval: { username: string };
};

export type StudentTabParamList = {
  Home: undefined;
  AddEntry: undefined;
  History: undefined;
  Leaderboard: undefined;
};

export type SupervisorTabParamList = {
  Dashboard: undefined;
  KPIDashboard: undefined;
  Students: undefined;
  PendingStudents: undefined;
  Leaderboard: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  ManageSupervisors: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  StudentTabs: NavigatorScreenParams<StudentTabParamList>;
  SupervisorTabs: NavigatorScreenParams<SupervisorTabParamList>;
  AdminTabs: NavigatorScreenParams<AdminTabParamList>;
};

