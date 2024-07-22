import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import AuthProvider from "./provider/AuthProvider";
import {AlertProvider} from "./provider/AlertProvider";
import RouteMap from "./routes/Routes";

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <RouteMap />
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
