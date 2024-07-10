export const NotificationDetail = () => {
    const [notification, setNotification] = useState([]);
    const navigator = useNavigate();
    const [token] = useAuth();
  
    useEffect(() => {
      if (token) {
        const decodedToken = jwtDecode(token);
  
        axios({
          method: "GET",
          url: `${ServerUrl}/api/notification/${decodedToken.id}/get/${notificationId}`,
          headers: { "Content-Type": "Application/json" },
        }).then((res) => setNotification(res.data));
      }
    }, [token]);
  
    function acceptedReport() {
      navigator("/${orderId}/confirm?confirmed=true")
    }
  
    function declinedReport() {
      navigator("/${orderId}/confirm?confirmed=false")
    }
  
    return (
      <div>
        <div>
          <h2>{notification.report.title}</h2>
          <h3>{notification.report.type}</h3>
          <h3>{notification.report.sender}</h3>
          <p>{notification.report.description}</p>
          <button onClick={acceptedReport} className="btn btn-success">Accept</button>
          <button onClick={declinedReport} className="btn btn-danger">Decline</button>
        </div>
      </div>
    );
  }
  export default NotificationDetail