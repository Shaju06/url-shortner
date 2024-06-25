"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FormEvent, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createSuperbaseClient } from "@/utils/superbase/client";
import userSession from "@/use-session";

export default function Home() {
  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
  };
  const { session } = userSession();

  console.log(session);

  return (
    <section className="flex justify-center items-center flex-col">
      <div>
        <h2 className="text-3xl sm:text-6xl lg:text-7xl my-10 text-gray-600 font-extrabold text-center">
          The only URL Shortener <br /> you’ll ever need! 👇
        </h2>
        <form
          onSubmit={handleSubmit}
          className="w-full  flex flex-col sm:flex-row gap-2 md:px-20 "
        >
          <Input className="" type="url" placeholder="Enter your url" />
          <Button>Url shortener</Button>
        </form>
        <div className="mt-10 w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It's animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
