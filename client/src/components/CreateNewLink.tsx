"use client";

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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as yup from "yup";
import { Card } from "./ui/card";
import useFetch from "@/useFetch";
import { createUrl } from "@/app/actions";
import useSession from "@/use-session";
import { QRCode } from "react-qrcode-logo";
import ValidationError from "./ValidationError";
import { ReloadIcon } from "@radix-ui/react-icons";

const CreateNewLink = () => {
  const qrRef = useRef<any>(null);
  let searchParams = useSearchParams();
  const longLink = searchParams.get("createNew");
  const { session } = useSession();
  const [formValues, setFormValues] = useState<{
    title: string;
    longUrl: string;
    customUrl: "";
  }>({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: session?.user?.id });

  const router = useRouter();

  console.log(error, data, "fdfdf");

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

  useEffect(() => {
    if (error === null && data) {
      router.push(`/link/${data[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = qrRef?.current?.canvasRef?.current;

      const base64Data = canvas.toDataURL().split(",")[1];
      console.log(base64Data, "base64Data");

      await fnCreateUrl(base64Data);
    } catch (err: any) {
      console.log(err, err?.inner, "ssdf");
      let newErrors: { [key: string]: string } = {};

      err?.inner?.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
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
          <QRCode ref={qrRef} size={200} value={formValues?.longUrl} />
        ) : null}

        <Input
          id="title"
          type="text"
          placeholder="Enter url title..."
          onChange={handleChange}
        />
        {errors?.title && <ValidationError message={errors.title} />}
        <Input
          id="longUrl"
          type="text"
          placeholder="Enter your url..."
          onChange={handleChange}
        />
        {errors?.longUrl && <ValidationError message={errors.longUrl} />}
        <div className="flex items-center gap-2">
          <Card className="p-2">trimrr.in</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <ValidationError message={JSON.stringify(errors)} />}
        <DialogFooter>
          <Button
            className="w-full rounded"
            variant={"default"}
            onClick={createNewLink}
            disabled={loading}
          >
            Create new
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewLink;
