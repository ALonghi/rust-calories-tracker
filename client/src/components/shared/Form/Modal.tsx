import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

type ModalProps = {
  children: JSX.Element;
  open: boolean;
  setOpen?: (value: boolean) => void;
  classes?: string;
  withoutOverlay?: boolean;
  bgClass?: string;
};
export default function Modal({
  children,
  open,
  setOpen,
  classes,
  withoutOverlay,
  bgClass,
}: ModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setOpen ? () => setOpen(false) : () => {}}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {!withoutOverlay ? (
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
          ) : (
            <div />
          )}
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0 w-full">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`relative transform rounded-lg ${
                  bgClass || `bg-themebg-500`
                } px-4 pt-5 pb-4 overflow-y-auto
              text-left shadow-xl transition-all sm:my-8 w-full sm:w-full sm:max-w-sm sm:p-6 ${
                classes || ``
              }`}
              >
                {setOpen && (
                  <XMarkIcon
                    className="absolute w-5 h-5 text-gray-400 top-5 right-5 cursor-pointer"
                    onClick={() => (setOpen ? setOpen(false) : null)}
                  />
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
