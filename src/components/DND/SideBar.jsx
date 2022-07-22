import React, { useContext, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MyContext } from "../../MyContext";
import { BlurDiv } from "../styled-components";

const SideBar = () => {
  const {
    allDNDItems,
    setAllDNDItems,
    createNewField,
    fieldType,
    fieldHeading,
    isGettingData,
    isLoading,
    showGrid,
  } = useContext(MyContext);

  const onDragEnd = (obj) => {
    if (!obj.destination) {
      return;
    }

    const localItems = [...allDNDItems];
    localItems.splice(obj.source.index, 1);
    localItems.splice(obj.destination.index, 0, allDNDItems[obj.source.index]);
    setAllDNDItems(localItems);
  };

  useEffect(() => {
    if (createNewField) {
      setAllDNDItems([
        ...allDNDItems,
        {
          id: fieldHeading,
          type: fieldType,
          content: ``,
        },
      ]);
    }
  }, [createNewField]);

  return isGettingData ? (
    <div className={!showGrid ? "DNDSideBarWrapper" : "d-none"}>
      <div className="d-flex text-center align-items-center mt-5 flex-column">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <div className="d-block w-100">
          <p>Fetching data</p>
        </div>
      </div>
    </div>
  ) : (
    <div className={!showGrid ? "DNDSideBarWrapper" : "d-none"}>
      <div className={allDNDItems.length ? "" : "d-none"}>
        <BlurDiv height="100%" className={isLoading ? "" : "d-none"}>
          <div className="d-flex text-center align-items-center mt-5 flex-column">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="d-block w-100">
              <p>Applying changes</p>
            </div>
          </div>
        </BlurDiv>

        <div>
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    padding: "8px",
                    height: "100%",
                    minHeight: "100vh",
                  }}
                >
                  {allDNDItems.map((item, idx) => (
                    <Draggable key={item.id} draggableId={item.id} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: "none",
                            margin: "8px",
                            backgroundColor: snapshot.isDragging
                              ? "lightpink"
                              : "lightgreen",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <h6
                            style={{
                              padding: "7px 0 7px 10px",
                              margin: "0",
                              backgroundColor: "lightgray",
                            }}
                          >
                            <div className="d-flex">
                              <div className="d-flex align-items-center">
                                <i
                                  className="fa fa-bars"
                                  style={{ fontSize: "16px" }}
                                ></i>
                              </div>
                              <div className="mx-sm-1">
                                <span className="d-inline-block">
                                  {item.type}
                                </span>
                              </div>
                            </div>
                          </h6>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
