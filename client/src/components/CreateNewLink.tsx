"use client";

import { QrCode } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ChangeEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as yup from "yup";
import { Card } from "./ui/card";
import useFetch from "@/useFetch";
import { createUrl } from "@/app/actions";
import userSession from "@/use-session";

const CreateNewLink = () => {
  const qrRef = useRef(null);
  let searchParams = useSearchParams();
  const longLink = searchParams.get("createNew");
  const { session } = userSession();
  const [formValues, setFormValues] = useState<{
    title: string;
    longUrl: string;
    customUrl: "";
  }>({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });
  const [errors, setErrors] = useState({});
  useFetch(createUrl, { ...formValues, user_id: session?.user?.id });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [evt.target.id]: evt.target.value,
    });
  };

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const createNewLink = async () => {
    try {
      await schema.validate(formValues, { abortEarly: false });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create new Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            Create New Link
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        {formValues?.longUrl ? (
          <QrCode
            ref={qrRef}
            className="w-full"
            size={200}
            values={formValues?.longUrl}
          />
        ) : null}

        <Input
          id="title"
          type="text"
          placeholder="Enter url title..."
          onChange={handleChange}
        />
        <Input
          id="longUrl"
          type="text"
          placeholder="Enter your url..."
          onChange={handleChange}
        />
        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        <DialogFooter>
          <Button
            className="w-full rounded"
            variant={"default"}
            onClick={createNewLink}
          >
            Create new
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewLink;
