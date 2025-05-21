import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { useEffect } from "react";
import { useAuthStore } from "./stores";
import { RouterConfig } from "./routes/RouterConfig";

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);

  // const permissions = user?.permissions;
  // if (permissions) {
  //   console.log(permissions.some((item: string) => item === "manage_users"));
  // }

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterConfig />
    </Router>
  );
}
