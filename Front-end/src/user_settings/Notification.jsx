import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../provider/AuthProvider";

function NotificationPage() {
  const [data, setData] = useState();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);

      axios({
        method: "GET",
        url: `${ServerUrl}/api/notification/${decodedToken.id}/get-all`,
        headers: { "Content-Type": "Application/json" },
      }).then((res) => setData(res.data));
    }
  });

  const getNotification = data.map((i) => {
    return (
      <>
        <tr key={i.id}>
          <td>{i.time}</td>
          <td>{i.type}</td>
          <td>{i.from}</td>
          <td>{i.title}</td>
          <td>{i.status}</td>
        </tr>
      </>
    );
  });

  return (
    <Container>
      <Table className="mt-3" hover>
        <thead>
          <tr>
            <th>Time</th>
            <th>Type</th>
            <th>From</th>
            <th>Title</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>{getNotification}</tbody>
      </Table>
    </Container>
  );
}

export default NotificationPage;
