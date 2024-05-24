import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <>
      <footer>
        <Container className="footer-box">
          <Row>
            <Col>
              <div className="footer-content">
                <div>
                  <h4 className="footer-title">宝石店</h4>
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </Col>
            <Col>
              <div className="footer-content">
                <div>
                  <h4 className="footer-title">Quick Link</h4>
                </div>
                <p>Link A</p>
                <p>Link B</p>
                <p>Link C</p>
                <p>Link D</p>
                <p>Link E</p>
              </div>
            </Col>
            <Col>
              <div className="footer-content">
                <div className="footer-title">
                  <h4>Contact Us</h4>
                </div>
                <p>Phone: 607-647-4949</p>
                <p>Gmail: placeholder@gmail.com</p>
              </div>
            </Col>
            <Col>
              <div className="footer-content">
                <div className="footer-title">
                  <h4>Address</h4>
                </div>
                <p>1771 Frosty Lane, Mcdonough, New York 13801</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <div className="footer-content-social">
                <div className="footer-title">
                  <h4>Social Media</h4>
                </div>
                <div className="social-icon">
                  <a href="https://www.facebook.com/" target="_blank">
                    <FontAwesomeIcon icon={faFacebook} size="xl" />
                  </a>
                  <a href="https://www.instagram.com/" target="_blank">
                    <FontAwesomeIcon icon={faInstagram} size="xl" />
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=LlN8MPS7KQs"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon={faYoutube} size="xl" />
                  </a>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div>
                <input
                  className="order-button"
                  type="submit"
                  value="Design Your Own"
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="footer-end-content">
                <div>
                  <p>Copyright Ⓒ jewelryshop.com 2024.</p>
                </div>
              </div>
            </Col>
            <Col>
              <div className="footer-end-content">
                <div className="policy-term-page">
                  <a href="#">Privacy Policy</a>
                  <a href="#">Return Policy</a>
                  <a href="#">Terms and service</a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
}
