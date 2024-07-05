import { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useAuth } from "../provider/AuthProvider";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ServerUrl from "../reusable/ServerUrl";

function OrderHistory() {
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
          <td>{i.name}</td>
          <td>{i.createdDate}</td>
          <td>{i.budget}</td>
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
            <th>Name</th>
            <th>Created Date</th>
            <th>Budget</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{/* {getNotification} */}</tbody>
      </Table>
    </Container>
  );
}

export default OrderHistory;
