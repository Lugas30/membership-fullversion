"use client";

import { useAppDispatch } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { getFaq } from "@/redux/thunks/faqThunks";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { FadeLoader } from "react-spinners";
import Image from "next/image";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import "react-accessible-accordion/dist/fancy-example.css";

export default function Faq() {
  const dispatch = useAppDispatch();
  const { error, data } = useSelector((state: RootState) => state.faq);

  useEffect(() => {
    dispatch(getFaq());
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
                <span className="text-xl">FAQ</span>
              </div>
            </div>
            <p className="text-[10px] text-center tracking-wider my-6 fontMon leading-relaxed">
              Temukan jawaban atas pertanyaan umum seputar layanan kami di
              halaman FAQ ini. Kami telah merangkum informasi penting untuk
              membantu Anda memahami lebih baik fitur dan layanan yang tersedia.
            </p>
          </div>

          {/* content */}
          <div className="p-4 text-sm tracking-wider">
            <Accordion allowZeroExpanded>
              {data.faqCategoryData?.map((category: any) => (
                <AccordionItem key={category.id}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      {category.description}
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Accordion allowZeroExpanded>
                      {" "}
                      {/* Membolehkan panel dalam untuk membuka lebih dari satu */}
                      {category.faqData?.map((faq: any) => (
                        <AccordionItem key={faq.ID}>
                          <AccordionItemHeading>
                            <AccordionItemButton>
                              {faq.TITLE}
                            </AccordionItemButton>
                          </AccordionItemHeading>
                          <AccordionItemPanel className="text-[10px] fontMon p-4">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: faq.DESCRIPTION,
                              }}
                            />
                          </AccordionItemPanel>
                        </AccordionItem>
                      )) || <p>Tidak ada data FAQ tersedia.</p>}
                    </Accordion>
                  </AccordionItemPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
