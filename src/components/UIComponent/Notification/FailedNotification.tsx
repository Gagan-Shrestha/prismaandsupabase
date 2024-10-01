/** @format */
"use client";

import { errorToast } from "../Toast/Toast";


interface FailedNotificationProps {
  message: string;
}
const FailedNotification: React.FC<FailedNotificationProps> = ({ message }) => {
  return errorToast(message);
};

export default FailedNotification;
