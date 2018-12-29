import { notification } from 'antd';

const notifications: Notification[] = [];

export function debugInfo(description: string) {
  notification.info({
    message: 'Debug',
    description,
    placement: 'bottomLeft',
    className: 'pre'
  });
}

export function notifyError(message, description, duration = 5) {
  const exist = notifications.find(({ message: m, description: d, duration, ts }) => {
    return message === m
      && description === d
      && (new Date().getTime() - ts) <= duration * 1000;
  });

  if (!exist) {
    notifications.push({
      message,
      description,
      duration,
      ts: new Date().getTime()
    });
    notification.error({
      message,
      description,
      duration
    });
  }
}


export function notifyInfo(message, description, duration?) {
  notification.info({
    message,
    description,
    duration
  });
}

export function handleError(message, error: Error, showNotification = true) {
  console.error(message, error);
  if (showNotification) {
    notifyError(message, error.message);
  }
}

export interface Notification {
  message: string;
  description: string;
  duration: number;
  ts: number;
}
