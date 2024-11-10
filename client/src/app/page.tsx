"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

export default function Home() {
  const [longUrl, setLongUrl] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    if (longUrl) router.push(`/auth?createNew=${longUrl}`);
  };

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
          <Input
            className=""
            type="url"
            placeholder="Enter your url"
            onChange={(e) => setLongUrl(e.target.value)}
          />
          <Button className="bg-primary">Url shortener</Button>
        </form>
        <div className="mt-20 w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How does this URL shortener works?
              </AccordionTrigger>
              <AccordionContent>
                When you enter a long URL, our system generates a shorter
                version of that URL. This shortened URL redirects to the
                original long URL when accessed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Do I need to create a accout?</AccordionTrigger>
              <AccordionContent>
                Yes. Creating an account allows you to manage your URLs, view
                analytics, and customize your short URLs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                What analytics are available for my shortened URLs?
              </AccordionTrigger>
              <AccordionContent>
                You can view the number of clicks, geolocation data of the
                clicks and device types (mobile/desktop) for each of your
                shortened URLs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
