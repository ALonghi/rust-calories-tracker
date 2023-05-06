import { nanoid } from "nanoid";

export type ToastType = `success` | `info` | `error`;

export interface IToast {
  id: string;
  details: string;
  type: ToastType;
  duration: number;
  nonClosable: boolean;
}

export const createToast = (
  details: string,
  type: ToastType,
  nonClosable?: boolean,
  duration?: number
) => {
  const notification: IToast = {
    id: nanoid(16),
    details: details,
    type: type,
    duration: duration || type === "success" ? 3000 : 8000,
    nonClosable: !!nonClosable,
  };
  return notification;
};
