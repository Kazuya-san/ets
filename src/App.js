import "./styles.css";
import { FlowBuilder } from "./components";
import { Row, Col } from "antd";
import ValueProvider from "./context/ValueProvider";

export default function App() {
  return (
    <ValueProvider>
      <div className="App">
        <Row gutter={[32, 0]}>
          <Col span={24}>
            <FlowBuilder />
          </Col>
        </Row>
      </div>
    </ValueProvider>
  );
}
