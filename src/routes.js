
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import People from "@material-ui/icons/People"
import AccountTree from "@material-ui/icons/AccountTree"
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "./views/Dashboard/Dashboard.js";
import UserProfile from "./views/UserProfile/UserProfile.js";
import TableList from "./views/TableList/TableList.js";
import Typography from "./views/Typography/Typography.js";
import Icons from "./views/Icons/Icons.js";
import NotificationsPage from "./views/Notifications/Notifications.js";
// core components/views for RTL layout

const dashboardRoutes = [
  /*{
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },*/
  {
    path: "/user",
    name: "My Profile",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Accounts",
    rtlName: "قائمة الجدول",
    icon: AccountTree,
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Users",
    rtlName: "طباعة",
    icon: People,
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    rtlName: "إخطارات",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin"
  }
];

export default dashboardRoutes;
