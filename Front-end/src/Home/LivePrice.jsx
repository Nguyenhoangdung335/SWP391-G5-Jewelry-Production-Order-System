import React, { useEffect, useState } from "react";
// import { useEffect, useState } from "react";
// import { fetchEventSource } from "@microsoft/fetch-event-source";
// import { Container, Table } from "react-bootstrap";

const baseUrl = "http://localhost:8080";

// function LivePrice() {
//   const [data, setData] = useState([]);

//   //   useEffect(() => {
//   //     const controller = new AbortController();
//   //     const signal = controller.signal;
//   //     const fetchData = () => {
//   //       fetchEventSource(`${baseUrl}/api/v1/crawls`, {
//   //         method: "GET",
//   //         headers: {
//   //           Accept: "text/event-stream",
//   //         },
//   //         signal: signal,
//   //         onopen(res) {
//   //           if (res.ok && res.status === 200) {
//   //             // Status should be a number
//   //             console.log("connection made", res);
//   //           } else if (
//   //             res.status >= 400 &&
//   //             res.status < 500 &&
//   //             res.status !== 429
//   //           ) {
//   //             console.log("Client side error", res);
//   //           }
//   //         },
//   //         onmessage(event) {
//   //           console.log(event.data);
//   //           const parsedData = JSON.parse(event.data);
//   //           setData((data) => [...data, parsedData]);
//   //         },
//   //         onclose() {
//   //           console.log("Connection closed by the server");
//   //         },
//   //         onerror(err) {
//   //           console.log("There was an error from the server: " + err);
//   //         },
//   //       });
//   //     };

//   //     fetchData();
//   //     return () => {
//   //       controller.abort();
//   //       console.log("Connection aborted");
//   //     };
//   //   }, []);

//   useEffect(() => {
//     let eventSource;
//     const startSSE = () => {
//       eventSource = new EventSource(`${baseUrl}/api/v1/crawls`);

//       eventSource.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         console.log('Received event:', data);
//         if (data.event === 'live') {
//           // Update state with the new price updates
//           setData(data.data);
//         } else if (data.event === 'heartbeat') {
//           // Handle heartbeat event if needed
//           console.log('Received heartbeat');
//         }
//       };

//       eventSource.onerror = function (err) {
//         console.error("EventSource failed:", err);
//         // Optionally, try to reconnect
//         setTimeout(startSSE, 5000);
//       };

//       // Start SSE when the page loads
//       window.addEventListener("load", function () {
//         startSSE()
//       });

//       // Close SSE when the page unloads (e.g., user navigates away or closes the tab)
//       window.addEventListener("beforeunload", function () {
//         if (eventSource) {
//           eventSource.close();
//         }
//       });

//       // Also handle single page application navigation
//       window.addEventListener("popstate", function () {
//         if (eventSource) {
//           eventSource.close();
//         }
//       });

//       // You might also handle other events like page visibility changes
//       document.addEventListener("visibilitychange", function () {
//         if (document.visibilityState === "hidden" && eventSource) {
//           eventSource.close();
//         }
//       });
//     };
//   }, []);

//   return (
//     <Container fluid className="pt-2 pb-2">
//       <Table bordered hover>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Price</th>
//             <th>Time</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((dataItem) => {
//             console.log("jklksdj", dataItem);
//             return (
//               <tr key={dataItem.id}>
//                 <td>{dataItem.name}</td>
//                 <td>{dataItem.price}</td>
//                 <td>{dataItem.crawlTime}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </Table>
//     </Container>
//   );
// }

// export default LivePrice;

const LivePrice = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    let eventSource = new EventSource(`${baseUrl}/api/v1/crawls`);

    const onMessage = (event) => {
        console.log(event)
      if (event.data !== "heartbeat") {
        setUpdates((prevUpdates) => [...prevUpdates, event.data]);
        
      }
    };

    const onError = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
      // Optionally, try to reconnect
      setTimeout(() => {
        eventSource = new EventSource(`${baseUrl}/api/v1/crawls`);
        eventSource.onmessage = onMessage;
        eventSource.onerror = onError;
      }, 5000);
    };

    eventSource.onmessage = onMessage;
    eventSource.onerror = onError;

    window.addEventListener("beforeunload", () => {
      eventSource.close();
    });

    // Also handle single page application navigation
    window.addEventListener("popstate", () => {
      eventSource.close();
    });

    // Handle page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        eventSource.close();
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  console.log(updates)

  return (
    <>
    </>
  );
};

export default LivePrice;
