import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

function LinkAnimation({ children }) {
  const [state, setState] = useState(false);

  const handleClick = () => {};

  return <div onClick={handleClick}>{children}</div>;
}

function SideBar() {
  const { setToken } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "100vh",
        boxShadow: " 1px 0 10px -3px",
      }}
    >
      <div className="text-center p-4 text-decoration-none">
        <Link to="/" className="text-decoration-none text-black">
          <h1 className="fw-bold">宝石店</h1>
        </Link>
      </div>
      <div className=" side-bar-item side-bar-ltr">
        <div style={{ padding: "15px 30px 9px" }}>
          <Link
            to="/user_setting_page"
            className="text-decoration-none text-black"
          >
            <h5>Profile</h5>
          </Link>
        </div>
      </div>
      <div className=" side-bar-item side-bar-ltr">
        <div style={{ padding: "15px 30px 9px" }}>
          <Link
            to="/user_setting_page/order_history_page"
            className="text-decoration-none text-black"
          >
            <h5>Order History</h5>
          </Link>
        </div>
      </div>
      <div className=" side-bar-item side-bar-ltr">
        <div style={{ padding: "15px 30px 9px" }}>
          <Link
            to="/user_setting_page/notification_page"
            className="text-decoration-none text-black"
          >
            <h5>Notification</h5>
          </Link>
        </div>
      </div>
      <div className=" side-bar-item side-bar-ltr">
        <div style={{ padding: "15px 30px 9px" }}>
          <Link
            to="/login"
            onClick={handleLogout}
            className="text-decoration-none text-black"
          >
            <h5>Logout</h5>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
