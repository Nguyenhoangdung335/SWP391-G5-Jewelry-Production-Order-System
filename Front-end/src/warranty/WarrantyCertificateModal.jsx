import warrantyCertificateHTML from "./warrantyCertificate";
import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import html2pdf from "html2pdf.js";
import warranty_logo from "./../assets/warranty_logo.png"

function WarrantyCertificateModal({ data, show, handleClose }) {
  const certificateRef = useRef();

  const handleDownloadPDF = () => {
    const element = certificateRef.current.querySelector('.certificate');
    const opt = {
      margin: 0,
      filename: 'warranty_certificate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: 'px',
        format: [element.offsetWidth, element.offsetHeight],
        orientation: 'landscape',
      }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Warranty Certificate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div ref={certificateRef}>
          <div className="certificate">
            <div className="border">
              <h1>WARRANTY CERTIFICATE</h1>
              <h2>Warranty policy</h2>
              <div id="content">
                <p>
                  The product warranty is valid only in the presence of:
                  original purchase document (receipt, invoice), correctly and
                  completely filled out warranty card.
                </p>
              </div>
              <div className="service-info">
                <p>
                  <strong>Service: </strong>
                  <span>Accident insurance</span>
                </p>
                <p>[certificate.uuid]</p>
              </div>
              <div className="signatures">
                <div className="signature">
                  <hr />
                  <p>Nguyen Hoang Dung | Insurer</p>
                  <p>
                    Phone number:
                    <br />
                    +1 (847) 037 - 3856
                  </p>
                </div>
                <div className="seal">
                  <img
                    src={warranty_logo}
                    alt="Quality Guarantee"
                  />
                </div>
                <div className="signature">
                  <hr />
                  <p>Jeremiah Elmers | Customer</p>
                  <p>
                    Warranty Period:
                    <br />
                    [certificate.expired_on]
                  </p>
                </div>
              </div>
              <div className="company-info">
                <p>
                  Your company name
                  <br />
                  www.yourcompany.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Modal.Footer>
      <style jsx>{`
        p {
          text-align: center;
        }

        .certificate {
          width: 800px;
          height: 600px;
          padding: 10px;
          background-color: #fff;
          border: 10px solid #679bea; /* Blue border */
          position: relative;
          box-sizing: border-box;
          font-family: "Arial", sans-serif;
        }

        .border {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 20px;
          border: 5px solid #679bea; /* Blue inner border */
          box-sizing: border-box;
        }

        h1 {
          text-align: center;
          font-size: 45px;
          margin: 0;
          color: #0d1b4d;
        }

        h2 {
          text-align: center;
          font-size: 20px;
          margin-top: 2em;
          color: #0d1b4d;
        }

        #content {
          font-size: 18px;
          margin-top: 2em;
          width: 100%;
        }

        #content p {
          width: 60ch;
          margin: 0 auto;
          font-size: inherit;
          color: #000;
        }

        .service-info {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 20px 0;
        }

        .service-info p {
          border: 2px solid #679bea;
          border-radius: 10px;
          padding: 10px;
          margin: 0 10px;
          font-size: 14px;
          width: 32%;
        }

        .signatures {
          position: absolute;
          bottom: 3%;
          left: 5%;
          right: 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 40px 0;
        }

        .signature p {
          margin: 5px 0;
        }

        .signature p:first-child {
          margin-bottom: 10px;
        }

        .seal img {
          display: block;
          position: absolute;
          bottom: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 150px;
        }

        .company-info {
          position: absolute;
          bottom: 3%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 14px;
        }

        @media print {
          body {
            margin: 0;
          }

          .certificate {
            border: none;
          }

          .border {
            border: none;
          }
        }
      `}</style>
    </Modal>
  );
}

export default WarrantyCertificateModal;
