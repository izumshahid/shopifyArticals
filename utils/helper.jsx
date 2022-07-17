import { notification } from "antd";

export const notificationError = ({
  message = "",
  description = "",
  placement = "bottomLeft",
}) => {
  notification.error({
    message,
    description,
    placement,
    style: {
      background: "lightcoral",
    },
  });
};

export const notificationSuccess = ({
  message = "",
  description = "",
  placement = "bottomLeft",
}) => {
  notification.success({
    message,
    description,
    placement,
    style: {
      background: "lightgreen",
    },
  });
};
