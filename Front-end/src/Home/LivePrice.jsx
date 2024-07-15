import React, { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Container, Table } from "react-bootstrap";
import ServerUrl from "../reusable/ServerUrl";

const baseUrl = `${ServerUrl}/api/v1/crawls`;

function LivePrice() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(baseUrl);

    // Close SSE when the page unloads (e.g., user navigates away or closes the tab)
    window.addEventListener("beforeunload", function () {
      if (eventSource) {
        console.log("SSE close");
        eventSource.close();
      }
    });

    // Also handle single page application navigation
    window.addEventListener("popstate", function () {
      if (eventSource) {
        console.log("SSE close");
        eventSource.close();
      }
    });

    // You might also handle other events like page visibility changes
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden" && eventSource) {
        console.log("SSE close");
        eventSource.close();
      }
    });

    eventSource.onopen = (event) => {};

    eventSource.addEventListener("live", (event) => {
      setData(JSON.parse(event.data));
    });

    eventSource.addEventListener("heartbeat", (event) => {
      console.log("Heartbeat");
    });

    // eventSource.onmessage = (event) => {
    //   console.log("The connection has been established");
    //   if (event.data) {
    //     console.log(event.data)
    //     setData(JSON.parse(event));
    //   }
    // };
    eventSource.onerror = (event) => {
      console.log("There an error in the connection");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Container className="pt-5 pb-4 w-75">
      <div className="text-center pb-3">
        <h2>Real Time Gold Price</h2>
      </div>
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
          {data &&
            data.map((dataItem) => {
              return (
                <tr key={dataItem.id}>
                  <td>{dataItem.id}</td>
                  <td>Gold / {dataItem.name}</td>
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
