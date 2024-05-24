import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function Header() {
  return (
    <div className="header">
      <Container fluid>
        <Row>
          <Col>
            <div id="company-logo">
              <h1 id="logo-image">宝石店</h1>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Header;
