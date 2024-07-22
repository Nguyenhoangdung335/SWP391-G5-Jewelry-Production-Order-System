import React, { useEffect, useRef, useState } from "react";
import imgTesla from "../assets/imgTesla.png";
import Oppenheimer from "../assets/Oppenheimer.png";
import hoden from "../assets/hoden.png";
import ourMission from "../assets/ourMission.png";

export default function About() {
  const scrollRef = useRef(null);
  const [scrollActivated, setScrollActivated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setScrollActivated(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const styles = {
    container: {
      padding: "6% 0%",
      overflowX: "hidden",
      scrollBehavior: "smooth",
      backgroundColor: "#f5f5f5",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    section: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
    },
    textCenter: {
      textAlign: "center",
    },
    imgFull: {
      width: "100%",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    paddingX2: {
      paddingLeft: "2%",
      paddingRight: "2%",
    },
    paddingX6: {
      paddingLeft: "6%",
      paddingRight: "6%",
    },
    headerText: {
      fontSize: 36,
      fontWeight: 700,
      color: "#333",
    },
    subHeaderText: {
      fontSize: 24,
      fontStyle: "italic",
      fontWeight: 400,
      marginBottom: "2%",
      color: "#555",
    },
    borderedText: {
      borderBottom: "1px solid #ddd",
      paddingBottom: "4%",
      color: "#666",
    },
    missionContainer: {
      marginTop: "6%",
      marginLeft: "6%",
      marginRight: "6%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    missionHeader: {
      fontSize: 50,
      fontWeight: 700,
      borderBottom: "1px solid #ddd",
      width: "100%",
      paddingBottom: "1%",
      textAlign: "center",
      color: "#333",
    },
    missionText: {
      margin: "3% 0%",
      padding: "0 3%",
      textAlign: "center",
      color: "#666",
    },
    missionImg: {
      width: "950px",
      height: "440px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    button: {
      backgroundColor: "#007BFF",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div ref={scrollRef} style={styles.container}>
      <div style={styles.section} className="row mt-5">
        <div className="col-6">
          <img style={{ ...styles.imgFull, height: "75vh" }} src={imgTesla} alt="Tesla image" />
        </div>
        <div style={styles.paddingX6} className="col-6 d-flex flex-column justify-content-center">
          <p style={styles.headerText}>About Us</p>
          <p style={styles.borderedText}>
          CaraJewel System proudly stands as one of the pioneering platforms providing optimal and comprehensive solutions for the jewelry industry. We constantly strive to deliver high-quality products and services that meet the diverse needs of our customers.
          </p>
        </div>
      </div>
      <div style={styles.section} className="row mt-5">
        <div style={styles.paddingX6} className="col-6 d-flex flex-column justify-content-center">
          <p style={styles.headerText}>Our Team</p>
          <p style={styles.subHeaderText}>
          Our Group 5 consists of passionate and talented members, always ready to contribute to the continuous growth of CaraJewel System:
          </p>
          <p style={styles.borderedText}>
          - Nguyen Hoang Dung: Dung is a software development expert with exceptional programming skills. He consistently brings innovative and effective technological solutions.<br/>
          - Vu Tien Đat: Đat is a software engineer with extensive knowledge in database management systems. He plays a crucial role in optimizing the system and ensuring the platform's stability.<br/>
          - Nguyễn Viet Thai: With strong logical thinking and data analysis capabilities, Viet Thai significantly contributes to developing analytical and reporting solutions for the system.
          </p>
        </div>
        <div className="col-6">
          <img style={{ ...styles.imgFull, paddingLeft: "2%", height: "75vh" }} src={Oppenheimer} alt="Oppenheimer image" />
        </div>
      </div>
      <div style={styles.section} className="row mt-5">
        <div className="col-6">
          <img style={{ ...styles.imgFull, height: "75vh" }} src={hoden} alt="Black hole image" />
        </div>
        <div style={styles.paddingX6} className="col-6 d-flex flex-column justify-content-center">
          <p style={styles.borderedText}>
          - Tran Mai Quang Khai: With excellent leadership skills and sharp project management abilities, Quang Khai ensures the progress and quality of our developed products.<br/>
          - Bui Khanh Duy: Khanh Duy is an expert in user interfaces with unique UX/UI design skills, creating user-friendly and easy-to-use interfaces for users.
          </p>
        </div>
      </div>
      <div style={styles.missionContainer}>
        <p style={styles.missionHeader}>Our Mission</p>
        <p style={styles.missionText}>
        We believe that our success stems not only from the products we create but also from the trust and satisfaction of our customers with our services. Thank you for visiting and learning about us!
        </p>
        <img style={styles.missionImg} src={ourMission} alt="Our Mission" />
      </div>
    </div>
  );
}
