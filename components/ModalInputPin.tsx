import React, {
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
} from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import ErrorMessage from "./ErrorMessage";

type ModalInputPinProps = {
  pin: string;
  setPin: Dispatch<SetStateAction<string>>;
  handleCheckPin: (e: FormEvent<HTMLFormElement>) => void;
  closeModal: () => void;
  errorMessage: boolean;
  maxLength?: number;
};

const ModalInputPin: FC<ModalInputPinProps> = ({
  pin,
  setPin,
  handleCheckPin,
  maxLength,
  closeModal,
  errorMessage,
}) => {
  const handleInputPinChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  const [showPin, setShowPin] = React.useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50">
      <div className="bg-white w-full max-w-md shadow-lg p-6 rounded-t-2xl">
        <div className="flex justify-end items-center mb-4">
          <button onClick={closeModal} className="text-black">
            &#10005;
          </button>
        </div>

        <form onSubmit={handleCheckPin}>
          {errorMessage && <ErrorMessage message="PIN anda salah" />}
          <h2 className="text-lg font-bold text-center">Masukkan PIN</h2>

          {/* Input PIN */}
          <p className="text-gray-600 mb-4 text-center text-xs my-8 fontMon">
            Masukkan 6 digit angka PIN anda
          </p>

          <div className="mb-4 relative">
            <Input
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              pattern="[0-9]*"
              name="pin"
              maxLength={maxLength}
              value={pin}
              onChange={handleInputPinChange}
              className="mb-4"
            />

            <span
              className="absolute inset-y-0 top-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer text-[8px] fontMon"
              onClick={() => setShowPin(!showPin)}
            >
              {showPin ? <p>HIDE</p> : <p>SHOW</p>}
            </span>
          </div>

          <div className="flex justify-center items-center py-4">
            <Button
              type="submit"
              label="KIRIM"
              className="bg-base-accent text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInputPin;
