import React, { useEffect, useState } from "react";
import {Col, Container, Row, Table} from "react-bootstrap";
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

    eventSource.onerror = (event) => {
      console.log("There an error in the connection");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const formatDateTime = (dateTimeString) => {
    const [time, date] = dateTimeString.split(' ');
    const [day, month, year] = date.split('-');
    return {
      time,
      date: `${day}-${month}-${year}`
    };
  };

  const latestDateTime = data.length > 0 ? formatDateTime(data[0].updatedTime) : { time: '', date: '' };

  return (
      <Container className="pt-5 pb-4 w-75" style={{ height: "90vh" }}>
        <Row className="text-center pb-3">
          <Col>
            <h2 className="display-4">Real Time Gold Price</h2>
            <div className="pt-2">
              {latestDateTime.time && latestDateTime.date && (
                  <div>
                    <span className="d-block font-weight-bold">{latestDateTime.time}</span>
                    <span className="text-muted">{latestDateTime.date}</span>
                  </div>
              )}
            </div>
          </Col>
        </Row>
        <Table bordered hover responsive className="table-striped">
          <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Company Price ($)</th>
            <th>Market Price ($)</th>
          </tr>
          </thead>
          <tbody>
          {data &&
              data.map((dataItem) => (
                  <tr key={dataItem.id}>
                    <td>{dataItem.id}</td>
                    <td>{dataItem.name} {dataItem.unit}</td>
                    <td>{dataItem.companyPrice}</td>
                    <td>{dataItem.marketPrice}</td>
                  </tr>
              ))}
          </tbody>
        </Table>
      </Container>
  );
}

export default LivePrice;