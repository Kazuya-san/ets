import React from "react";
import { Row, Col, Form, Input } from "antd";
import { Handle, Position } from "react-flow-renderer";
import { RiDeleteBin2Line } from "react-icons/ri";

const ChoiceNode = (props) => {
  return (
    <>
      <div>
        <Row gutter={24} align="middle">
          <Col span={24} className="da-text-center">
            {/* Delete Choice Icon */}
            <RiDeleteBin2Line
              className="da-icon da-icon-delete"
              onClick={() => props.deleteChoice()}
            />
            {/* Welcome Message */}
            <Form.Item>
              <Input
                name="choiceMessage"
                placeholder="Enter your message"
                onChange={props.updateChoiceMessage}
                value={props.message}
              />
            </Form.Item>

            <Handle
              type="source"
              position={Position.Right}
              id="b"
              style={{
                background: "#555",
                borderRadius: "50%",
                width: "20px",
                height: "20px"
              }}
              isConnectable={props.isConnectable}
              onConnect={(params) => console.log("handle onConnect", params)}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ChoiceNode;
