import React, { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Container, Table } from "react-bootstrap";

const baseUrl = "http://localhost:8080/api/v1/crawls";

function LivePrice() {
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  //   const fetchData = () => {
  //     fetchEventSource(`${baseUrl}`, {
  //       method: "GET",
  //       headers: {
  //         // Accept: "text/event-stream",
  //         'Content-Type': 'application/json',
  //       },
  //       signal: signal,
  //       onopen(res) {
  //         if (res.ok && res.status === 200) {
  //           // Status should be a number
  //           console.log("connection made", res);
  //         } else if (
  //           res.status >= 400 &&
  //           res.status < 500 &&
  //           res.status !== 429
  //         ) {
  //           console.log("Client side error", res);
  //         }
  //       },
  //       onmessage(event) {
  //         console.log(event.data);
  //         const parsedData = JSON.parse(event.data);
  //         setData((data) => [...data, parsedData]);
  //       },
  //       onclose() {
  //         console.log("Connection closed by the server");
  //       },
  //       onerror(err) {
  //         console.log("There was an error from the server: " + err);
  //       },
  //     });
  //   };
  //   fetchData();
  //   return () => {
  //     controller.abort();
  //     console.log("Connection aborted");
  //   };
  // }, [baseUrl]);

  useEffect(() => {
    const eventSource = new EventSource(baseUrl);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received event:', data);
      if (data.event === 'live') {
        // Update state with the new price updates
        console.log(data);
      } else if (data.event === 'heartbeat') {
        // Handle heartbeat event if needed
        console.log('Received heartbeat');
      }
    };
  }, []);

  return (
    <Container fluid className="pt-2 pb-2">
      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dataItem) => {
            // console.log("jklksdj", dataItem);
            return (
              <tr key={dataItem.id}>
                <td>{dataItem.name}</td>
                <td>{dataItem.price}</td>
                <td>{dataItem.crawlTime}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default LivePrice;
