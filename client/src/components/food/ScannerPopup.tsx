import React, { useEffect, useRef, useState } from "react";
import Modal from "@components/shared/Form/Modal";
import { createToast, IToast } from "@model/toast";
import { addNotification } from "@stores/notificationStore";
import Quagga from "quagga";
import Spinner from "@components/shared/Spinner";
import Button from "@components/shared/Buttons/Button";
import InputForm from "@components/shared/Form/InputForm";
import _ from "lodash";
import { instance as axios } from "@utils/axios";
import validbarcode from "barcode-validator";

type ScannerPopupProps = {
  isOpen: boolean;
  closePopup: Function;
};
const ScannerPopup = ({ isOpen, closePopup }: ScannerPopupProps) => {
  const [barcode, setBarcode] = useState<string>(``);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasCameraPermissions, setHasCameraPermissions] =
    useState<boolean>(false);

  const throttled = useRef(
    _.throttle((barcode) => updateBarcode(barcode), 1000, { trailing: false })
  );
  useEffect(() => {
    throttled.current(barcode);
  }, [barcode]);

  const updateBarcode = (newCode: string) => {
    setBarcode((prev) => {
      if (prev != newCode) {
        return newCode;
      } else return prev;
    });
  };

  const searchForProducts = () => {
    axios
      .post(``)
      .then(() => {})
      .catch((err) => {
        const toast = createToast(
          `Error in product search ${err.message}`,
          "error",
          true
        );
        addNotification(toast);
      });
  };

  const onDetected = (result) => {
    throttled.current(result?.codeResult?.code || ``);
  };
  const askCameraPermission = async (): Promise<MediaStream | null> =>
    await navigator.mediaDevices.getUserMedia({ video: true });

  useEffect(() => {
    const initQuagga = () => {
      return Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            constraints: {
              height: 250,
              facingMode: "environment",
            },
            //   area: { // defines rectangle of the detection/localization area
            //     top: "10%",    // top offset
            //     right: "10%",  // right offset
            //     left: "10%",   // left offset
            //     bottom: "10%"  // bottom offset
            //   },
          },
          locator: {
            halfSample: false,
            patchSize: "medium", // x-small, small, medium, large, x-large
            debug: {
              showCanvas: false,
              showPatches: false, // chjanged
              showFoundPatches: false,
              showSkeleton: false,
              showLabels: false, // chjanged
              showPatchLabels: false,
              showRemainingPatchLabels: false,
              boxFromPatches: {
                showTransformed: false,
                showTransformedBox: false,
                showBB: false,
              },
            },
          },
          numOfWorkers: 4,
          frequency: 100,
          decoder: {
            readers: ["ean_reader"],
            debug: {
              drawBoundingBox: false,
              showFrequency: false,
              drawScanline: false,
              showPattern: false,
            },
          },
          locate: true,
          multiple: false,
        },
        function (err) {
          if (err) {
            const toast: IToast = createToast(
              `Error in scanning product: ${err.message || err}`,
              "error",
              true
            );
            addNotification(toast);
            return console.log(err);
          }
          setIsLoading(false);
          Quagga.start();
          const elems = document.getElementsByClassName("drawingBuffer");
          if (elems?.length > 0) {
            Array.from(elems)?.forEach((elem) => (elem.className = "hidden"));
          }
        }
      );
      Quagga.onDetected(onDetected);
    };

    askCameraPermission()
      .then((response) => {
        if (response.active) {
          initQuagga();
        }
        setHasCameraPermissions(response.active);
        return;
      })
      .catch((error) => {
        console.log(
          `Error in asking for permissions.. ${error.message} ${error.stackTrace} ${error}`
        );
      })
      .finally(() => setIsLoading(false));
    return () => {
      Quagga.offDetected(onDetected);
    };
  }, []);

  return (
    <Modal
      classes={`h-[75vh] max-w-full overflow-hidden`}
      open={isOpen}
      setOpen={() => closePopup()}
    >
      <div className={`max-w-full max-h-full text-white`}>
        <p className={`text-lg mt-8 text-center mb-0`}>
          {hasCameraPermissions ? `Scan` : `Search by`} product barcode
        </p>
        {isLoading && <Spinner classes={`mt-8`} />}
        <div
          id="interactive"
          className="viewport rounded-lg mt-8 !py-0 h-auto max-h-[9rem] mx-auto overflow-hidden"
        />
        <div className={`z-50`}>
          {hasCameraPermissions && (
            <div className={`flex justify-around items-center`}>
              <div className={`border-t w-3/12 border-themebg-300`} />
              <p className={`text-gray-500`}>or add manually</p>
              <div className={`border-t w-3/12 border-themebg-300`} />
            </div>
          )}
          <InputForm
            componentClasses={`mt-3`}
            type={"text"}
            name={"barcodeSearch"}
            placeholder={"Input barcode"}
            value={barcode}
            updateValue={(v) => setBarcode(v.toString())}
            fullWidth
          />
          <Button
            classes={``}
            text={"Search"}
            isDisabled={!validbarcode(barcode)}
            clickAction={() => searchForProducts()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ScannerPopup;
