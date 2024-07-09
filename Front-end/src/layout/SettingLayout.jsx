import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { Col, Container, Row } from "react-bootstrap";

function SettingPageLayout() {
  return (
    <Row>
      <Col md={3}>
        <div className="position-fixed w-25">
          <SideBar />
        </div>
      </Col>
      <Col  md={9}>
        <Container className="d-flex justify-content-center w-100 h-100">
          <Outlet />
        </Container>
      </Col>
    </Row>
  );
}

export default SettingPageLayout;
