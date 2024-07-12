import { Route, Routes } from "react-router-dom";

import Home from "../Home/Home";
import LandingPageLayout from "../layout/LandingPageLayout";
import Login from "../login/Login";
import SignUp from "../signup/SignUp";
import Information from "../signup/Information";
import ResetPassword from "../forgot_password/ResetPassword";
import OtpScreen from "../forgot_password/OtpScreen";
import ConfirmPassword from "../forgot_password/ConfirmPassword";
import Collections from "../Home/Collections";
import About from "../Home/About";
import Blogs from "../Home/Blogs";
import OrderPage1 from "../orderFlows/OrderPage1";
import UserManagerLayout from "../layout/UserManagerLayout";
import ClientManager from "../clientManager/ClientManager";
import DashboardManger from "../dashboard/DashboardManger";
import OrderManager from "../ordersManager/OrderManager";
import BlogManager from "../blogManager/BlogManager";
import EmployeeManager from "../employeeManager/EmployeeManager";
import ProtectedRoute from "./ProtectedRoute";
import LivePrice from "../Home/LivePrice";
import ProductManager from "../productManager/ProductManager";
import Chat from "../chat/MainChat";
import UserInfo from "../user_settings/UserInfo";
import SettingPageLayout from "../layout/SettingLayout";
import OrderHistory from "../user_settings/OrderHistory";
import NotificationPage from "../user_settings/Notification";
import OrderDetail from "../user_settings/detailpage/OrderDetail";
import OrderDetailManager from "../ordersManager/OrderDetailManager";
import NotificationDetail from "../user_settings/detailpage/NotificationDetail";

function RouteMap() {
  return (
    <Routes>
      <Route path="/" element={<LandingPageLayout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/info" element={<Information />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/otp" element={<OtpScreen />} />
        <Route path="/new_password" element={<ConfirmPassword />} />
        <Route path="/collections_page" element={<Collections />} />
        <Route path="/blogs_page" element={<Blogs />} />
        <Route path="/live_price_page" element={<LivePrice />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about_page" element={<About />} />
        <Route
          path="/order_page"
          element={
            <ProtectedRoute roles={["CUSTOMER"]}>
              <OrderPage1 />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/userManager"
        element={
          //<ProtectedRoute>
          <UserManagerLayout />
          //</ProtectedRoute>
        }
      ></Route>
      <Route path="/userManager" element={<UserManagerLayout />}>
        <Route
          index
          element={
            <ProtectedRoute
              roles={[
                "ADMIN",
                "MANAGER",
                "PRODUCTION_STAFF",
                "DESIGN_STAFF",
                "SALE_STAFF",
              ]}
            ></ProtectedRoute>
          }
        />
        <Route
          path="/userManager/dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <DashboardManger />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/client_manager"
          element={
            <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
              <ClientManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/orders_manager"
          element={
            <ProtectedRoute
              roles={[
                "ADMIN",
                "MANAGER",
                "PRODUCTION_STAFF",
                "DESIGN_STAFF",
                "SALE_STAFF",
              ]}
            >
              <OrderManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/orders_manager/order_detail"
          element={
            <ProtectedRoute
              roles={[
                "ADMIN",
                "MANAGER",
                "PRODUCTION_STAFF",
                "DESIGN_STAFF",
                "SALE_STAFF",
              ]}
            >
              <OrderDetailManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/blogs_manager"
          element={
            <ProtectedRoute roles={["ADMIN", "MANAGER", "SALE_STAFF"]}>
              <BlogManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/employees_manager"
          element={
            <ProtectedRoute roles={["ADMIN", "MANAGER"]}>
              <EmployeeManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/products_manager"
          element={
            <ProtectedRoute roles={["ADMIN", "MANAGER", "SALE_STAFF"]}>
              <ProductManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/profile"
          element={
            <ProtectedRoute
              roles={[
                "ADMIN",
                "MANAGER",
                "PRODUCTION_STAFF",
                "DESIGN_STAFF",
                "SALE_STAFF",
              ]}
            >
              <UserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userManager/notifications"
          element={
            <ProtectedRoute
              roles={[
                "ADMIN",
                "MANAGER",
                "PRODUCTION_STAFF",
                "DESIGN_STAFF",
                "SALE_STAFF",
              ]}
            >
              <NotificationPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/user_setting_page" element={<SettingPageLayout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <UserInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user_setting_page/order_history_page"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user_setting_page/order_detail_page"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user_setting_page/notification_page"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user_setting_page/notification_page/:notificationId"
          element={
            <ProtectedRoute>
              <NotificationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user_setting_page/order_detail_page"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default RouteMap;
