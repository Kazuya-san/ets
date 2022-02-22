/* eslint-disable array-callback-return */
import React, { useState, useCallback, useEffect, useContext } from "react";
import { Row, Col, Button } from "antd";
import ReactFlow, {
  ReactFlowProvider,
  removeElements,
  addEdge,
  updateEdge,
  MiniMap,
  Controls,
  Background,
  ConnectionLineType
} from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import WelcomeNode from "./WelcomeNode";
import ChoiceNode from "./ChoiceNode";
import { ValueContext } from "../context/ValueProvider";

const nodeTypes = {
  welcomeNode: WelcomeNode,
  choiceNode: ChoiceNode
};

const initialValues = {
  elements: [],
  counter: 0
};

const FlowBuilder = () => {
  const [reactflowInstance, setReactflowInstance] = useState(null); // ReactFlow instance
  const [values, setValues] = useState(initialValues);
  const [elements, setElements] = useState([]);
  const [currentElements, setCurrentElements] = useState([]);

  const { message } = useContext(ValueContext);
  // On load function
  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
      }
    },
    [reactflowInstance]
  );

  // Load flow instance
  useEffect(() => {
    if (reactflowInstance) {
      reactflowInstance.fitView();
    }
  }, [reactflowInstance]);

  useEffect(() => {
    if (reactflowInstance) {
      setCurrentElements(reactflowInstance.getElements());
    }
  }, [reactflowInstance]);

  // Set elements state
  useEffect(() => {
    // If elements already exists from API, preload that
    const existingElements = currentElements?.elements?.map((e) => {
      if (!e.data) {
        return e;
      }

      console.log(e.data);

      if (e.type === "welcomeNode") {
        //console.log(e.data.message);

        return {
          ...e,
          data: {
            ...e.data,
            message: e.data.message,
            image: e.data.image,
            choices: e.data.choices,
            updateMessage: (message) => {
              updateMessage(e.id, message);
              //console.log(message);
              return;
            },
            updateImage: (image) => {
              updateImage(e.id, image);
              //console.log(image);
              return;
            },
            updateChoices: (choices) => updateChoices(e.id, choices)
          }
        };
      }
    });

    // console.log("hello");
    // console.log(currentElements);
    setValues({
      ...values,
      elements:
        currentElements?.elements && currentElements?.elements.length > 0
          ? existingElements
          : [
              {
                id: "0",
                type: "welcomeNode",
                data: {
                  message: message,
                  image: "https://picsum.photos/200/300",
                  choices: [],
                  updateMessage: (message) => updateMessage("0", message),
                  updateImage: (image) => updateImage("0", image),
                  updateChoices: (choices) => updateChoices("0", choices)
                },
                position: { x: 0, y: 50 }
              }
            ],
      counter:
        currentElements?.elements?.length > 0
          ? currentElements.elements.length
          : 1
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentElements?.elements]);

  // Handle update text field present on any node
  const updateMessage = (id, message) => {
    const elements = [...values.elements];
    const index = elements.findIndex((element) => element.id === id);

    if (index >= 0) {
      elements[index].data.message = message;
      setElements({ ...values, elements });
    }
  };

  // Handle update image
  const updateImage = (id, image) => {
    const elements = [...values.elements];
    const index = elements.findIndex((element) => element.id === id);

    // Set the image of the node
    elements[index].data.image = image;
    // setElements({ ...values, elements });
  };

  // Handle update choice
  const updateChoices = (id, choices) => {
    const elements = [...values.elements];
    const index = elements.findIndex((element) => element.id === id);

    // Set the choice of the node
    elements[index].data.choices = choices;
    // setElements({ ...values, elements });
  };

  console.log("elements in flow builder", elements);
  console.log("values in flow builder", values);
  // console.log(currentElements);

  // Handle on save
  const onSave = () => {
    setValues({ ...values, elements: elements.elements });
    if (reactflowInstance) {
      const flow = reactflowInstance.toObject();
      //console.log("flow", flow);
    }
  };

  const onElementsRemove = useCallback(
    (elementsToRemove) =>
      setValues({
        ...values,
        elements: removeElements(values.elements, elementsToRemove)
      }),
    [values]
  );

  const onConnect = useCallback(
    (params) =>
      setValues({
        ...values,
        elements: addEdge(values.elements, params)
      }),
    [values]
  );

  // Handle update edge
  const onEdgeUpdate = (oldEdge, newConnection) =>
    setValues({
      ...values,
      elements: updateEdge(values.elements, oldEdge, newConnection)
    });

  const onElementClick = (event, element) => console.log("click", element);

  // Handle drag of nodes
  const onNodeDragStop = (event, node) => {
    // Find the element in the list of elements, update the elements position
    const elements = [...values.elements];
    const element = elements.find((element) => element.id === node.id);
    element.position = {
      x: node.position.x,
      y: node.position.y
    };
    setValues({
      ...values,
      elements
    });
  };
  return (
    <Row>
      <Col span={24}>
        <Row gutter={[32, 0]}>
          <Col
            span={24}
            style={{
              height: "85vh",
              width: "92.5vw",
              maxWidth: "100vw"
            }}
          >
            <ReactFlowProvider>
              <ReactFlow
                elements={values?.elements}
                onElementClick={onElementClick}
                onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                connectionLineType={ConnectionLineType.Bezier}
                onNodeDragStop={onNodeDragStop}
                onEdgeUpdate={onEdgeUpdate}
                style={{ background: "#063970", borderRadius: "5px" }}
                nodeTypes={nodeTypes}
                connectionLineStyle={{ stroke: "#fff" }}
                onLoad={onLoad}
                //prevent re render
                shouldUpdate={false}
                snapGrid={[15, 15]}
                elementsSelectable
                minZoom={0.6}
                maxZoom={1.2}
              >
                <MiniMap
                  nodeStrokeColor={(n) => {
                    if (n.type === "input") return "#063970";
                    if (n.type === "output") return "#ff0072";
                  }}
                  nodeColor={(n) => {
                    return "#fff";
                  }}
                  nodeBorderRadius={2}
                />
                <Controls />
                <Background variant="lines" gap={20} size={0.5} color="white" />
              </ReactFlow>
              <div className="save__controls">
                <Button
                  onClick={onSave}
                  style={{ width: "90px", height: "50px" }}
                >
                  save
                </Button>
              </div>
            </ReactFlowProvider>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default FlowBuilder;
