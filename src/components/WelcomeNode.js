import React, { useState, memo, useEffect, useContext } from "react";
import { Row, Col, Form, Input, Button, Upload } from "antd";
import { RiUpload2Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Choice from "./ChoiceNode";
import { ValueContext } from "../context/ValueProvider";

const WelcomeNode = memo((props) => {
  const [message, setMessage] = useState("");
  const { saveMessage } = useContext(ValueContext);
  const [image, setImage] = useState();
  const [choices, setChoices] = useState([{ message: "" }, { message: "" }]);

  useEffect(() => {
    setMessage(props.data.message);
    setImage(props.data.image);
    setChoices(props.data.choices);
  }, [props]);

  // Update message
  const updateMessage = (e) => {
    setMessage(e.target.value);
    saveMessage(e.target.value);
    props.data.updateMessage(message);
  };

  // Update image
  const updateImage = (e) => {
    setImage(e.file.name);
    props.data.updateImage(e.file.name);
  };

  // Add choice
  const addChoice = () => {
    setChoices([...choices, { message: "" }]);
    props.data.updateChoices([...choices, { message: "" }]);
  };

  // Update choice message
  const updateChoiceMessage = (e, index) => {
    const allChoices = [...choices];
    allChoices[index].message = e.target.value;
    setChoices(allChoices);
    props.data.updateChoices(allChoices);
  };

  // Delete choice
  const deleteChoice = (index) => {
    const allChoices = [...choices];
    allChoices.splice(index, 1);
    setChoices(allChoices);
    props.data.updateChoices(allChoices);
  };

  //console.log(message);

  return (
    <>
      <div
        style={{
          background: "grey",
          borderRadius: "10px",
          padding: "10px",
          margin: "10px",
          transform: "scale(0.8)"
        }}
      >
        <Row gutter={24} align="middle">
          <Col span={24} className="da-text-center">
            {/* Welcome Message */}
            <Form.Item>
              <Input
                name="welcomeMessage"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => updateMessage(e)}
              />
            </Form.Item>

            {/* Image placeholder */}
            <Form.Item>
              <img
                alt="welcome gif"
                src={image ? image : props.data.image}
                height={250}
                width={250}
                style={{
                  borderRadius: 10
                }}
              />
            </Form.Item>

            {/* Upload Button */}
            <Form.Item>
              <Upload
                beforeUpload={() => false}
                onChange={(e) => updateImage(e)}
              >
                <Button
                  type="primary"
                  icon={<RiUpload2Line className="remix-icon" />}
                >
                  Change media
                </Button>
              </Upload>
            </Form.Item>

            {/* Add choice button */}
            <Form.Item>
              <Button
                type="primary"
                icon={<AiOutlinePlusCircle className="remix-icon" />}
                onClick={() => {
                  addChoice();
                }}
              >
                Add choice
              </Button>
            </Form.Item>

            {/* Choices */}
            <Form.Item>
              {choices?.map((e, index) => {
                return (
                  <Choice
                    index={index}
                    type="welcome"
                    key={index + "_welcome"}
                    message={e.message}
                    updateChoiceMessage={(e) => updateChoiceMessage(e, index)}
                    deleteChoice={() => deleteChoice(index)}
                  ></Choice>
                );
              })}
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
});

export default WelcomeNode;
