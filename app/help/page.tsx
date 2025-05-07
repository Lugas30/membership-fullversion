"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getContact } from "@/redux/thunks/contactThunks";
import Image from "next/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import chat from "../../public/images/chat.svg";
import email from "../../public/images/email.svg";
import instagram from "../../public/images/instagram.svg";

export default function Help() {
  const dispatch = useAppDispatch();
  const { error, data } = useSelector((state: RootState) => state.contact);

  useEffect(() => {
    dispatch(getContact());
  }, [dispatch]);

  if (data == null) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-screen">
        <Image src="/images/logo.svg" width={150} height={150} alt="logo" />
        <FadeLoader color="#101E2B" width={5} />
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center w-full max-w-md bg-white md:rounded-lg min-h-screen">
        <div className="min-h-screen bg-white">
          <div className="flex flex-col bg-base-accent text-white rounded-b-3xl p-8">
            <div className="flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => window.history.back()}
                className="w-auto h-auto cursor-pointer absolute"
              >
                <path
                  d="M4 12L3.64645 11.6464L3.29289 12L3.64645 12.3536L4 12ZM19 12.5C19.2761 12.5 19.5 12.2761 19.5 12C19.5 11.7239 19.2761 11.5 19 11.5V12.5ZM9.64645 5.64645L3.64645 11.6464L4.35355 12.3536L10.3536 6.35355L9.64645 5.64645ZM3.64645 12.3536L9.64645 18.3536L10.3536 17.6464L4.35355 11.6464L3.64645 12.3536ZM4 12.5H19V11.5H4V12.5Z"
                  fill="white"
                />
              </svg>

              <div className="flex-grow flex justify-center">
                <span className="text-xl">Bantuan</span>
              </div>
            </div>
            <p className="text-[10px] text-center tracking-wider my-6 fontMon leading-relaxed">
              Jika Anda membutuhkan bantuan atau memiliki pertanyaan terkait
              layanan ini, silakan hubungi kami melalui informasi kontak yang
              tersedia di bawah ini. Tim kami siap membantu Anda.
            </p>
          </div>

          {/* content */}
          <div className="p-8">
            <div className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between mb-4">
              <a
                href={`https://wa.me/${data?.contactData.phoneNumber}`}
                target="_blank"
                className="flex justify-start items-center w-full gap-4"
              >
                <Image src={chat} alt="chat" width={22} height={22} />
                <small className="text-[10px] uppercase tracking-widest fontMon">
                  {data?.contactData.phoneNumber} (Whatsapp)
                </small>
              </a>
            </div>
            <div className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between mb-4">
              <div className="flex justify-start items-center w-full gap-4">
                <svg
                  fill="#000000"
                  height="22"
                  width="22"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 483.3 483.3"
                >
                  <g>
                    <g>
                      <path
                        d="M424.3,57.75H59.1c-32.6,0-59.1,26.5-59.1,59.1v249.6c0,32.6,26.5,59.1,59.1,59.1h365.1c32.6,0,59.1-26.5,59.1-59.1
			v-249.5C483.4,84.35,456.9,57.75,424.3,57.75z M456.4,366.45c0,17.7-14.4,32.1-32.1,32.1H59.1c-17.7,0-32.1-14.4-32.1-32.1v-249.5
			c0-17.7,14.4-32.1,32.1-32.1h365.1c17.7,0,32.1,14.4,32.1,32.1v249.5H456.4z"
                      />
                      <path
                        d="M304.8,238.55l118.2-106c5.5-5,6-13.5,1-19.1c-5-5.5-13.5-6-19.1-1l-163,146.3l-31.8-28.4c-0.1-0.1-0.2-0.2-0.2-0.3
			c-0.7-0.7-1.4-1.3-2.2-1.9L78.3,112.35c-5.6-5-14.1-4.5-19.1,1.1c-5,5.6-4.5,14.1,1.1,19.1l119.6,106.9L60.8,350.95
			c-5.4,5.1-5.7,13.6-0.6,19.1c2.7,2.8,6.3,4.3,9.9,4.3c3.3,0,6.6-1.2,9.2-3.6l120.9-113.1l32.8,29.3c2.6,2.3,5.8,3.4,9,3.4
			c3.2,0,6.5-1.2,9-3.5l33.7-30.2l120.2,114.2c2.6,2.5,6,3.7,9.3,3.7c3.6,0,7.1-1.4,9.8-4.2c5.1-5.4,4.9-14-0.5-19.1L304.8,238.55z"
                      />
                    </g>
                  </g>
                </svg>
                <a
                  href={`mailto:${data?.contactData.email}`}
                  className="text-[10px] uppercase tracking-widest fontMon"
                >
                  {data?.contactData.email}
                </a>
              </div>
            </div>
            {/* <div className="bg-white p-4 w-full rounded-lg border border-gray-300 flex items-center justify-between mb-4">
              <div className="flex justify-start items-center w-full gap-4">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    fill="#0F0F0F"
                  />
                  <path
                    d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                    fill="#0F0F0F"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                    fill="#0F0F0F"
                  />
                </svg>
                <a
                  href={data?.contactData.instagram}
                  target="_blank"
                  className="text-[10px] uppercase tracking-widest fontMon"
                >
                  {data?.contactData.instagram}
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
