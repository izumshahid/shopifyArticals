import styled from "styled-components";

export const StyledInput = styled.input`
  padding: 8px;
  border-radius: 8px;
  height: ${(props) => props.height || "40px"};
  font-size: 16px;
  margin-bottom: 15px;
  color: ${(props) => props.inputColor || "palevioletred"};
  width: ${(props) => props.width || "100%"};
  border: lightgray 1px solid;
  border-radius: 3px;
`;

export const StyledTextArea = styled.textarea`
  padding: 8px;
  border-radius: 8px;
  height: ${(props) => props.height || "100px"};
  font-size: 16px;
  margin-bottom: ${(props) => props.marginBottom || "15px"};
  color: ${(props) => props.inputColor || "palevioletred"};
  width: ${(props) => props.width || "100%"};
  border: lightgray 1px solid;
  border-radius: 3px;
`;

export const StyledDiv = styled.div`
  padding: 15px;
  width: ${(props) => props.width || "100%"};
  margin-bottom: ${(props) => props.marginbottom || "15px"};
  height: ${(props) => props.height || ""};
`;

export const StyledButton = styled.button`
  padding: ${(props) => props.padding || "8px"};
  border-radius: ${(props) => props.borderRadius || "8px"};
  font-size: ${(props) => props.fontSize || "18px"};
  margin-bottom: ${(props) => props.marginBotton || "15px"};
  margin-right: ${(props) => props.marginRight || "15px"};
  background-color: ${(props) => props.backgroundColor || "#0d6efd"};
  color: ${(props) => props.inputColor || "#fff"};
  border: ${(props) => props.border || "none"};
  width: ${(props) => props.width || "100px"};
  cursor: ${(props) => props.cursor || "pointer"};

  :hover {
    background-color: ${(props) => props.hoverBackgroundColor || "#0051c7"};
  }
`;

export const Spinner = styled.div`
   {
    color: ${(props) => props.color || "#0d6efd"};
    display: inline-block;
    width: ${(props) => props.width || "1.3rem;"};
    height: ${(props) => props.width || "1.3rem;"};
    vertical-align: -0.12em;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    -webkit-animation: 0.75s linear infinite spinner-border;
    animation: 0.75s linear infinite spinner-border;
  }
`;

export const BlurDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  position: absolute;
  backdrop-filter: blur(2px);
  width: ${(props) => props.width || "95%"};
  height: ${(props) => props.height || "68%"};
  z-index: ${(props) => props.zIndex || "1"};
`;
