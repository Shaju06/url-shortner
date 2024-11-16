import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useCallback } from "react";
import { deleteUrl } from "@/app/actions";
import useFetch from "@/useFetch";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url, fetchUrls }: { url: any; fetchUrls: () => void }) => {
  const truncateUrl = useCallback((url: string) => {
    const maxLength = 35;
    if (url?.length > maxLength) {
      return `${url.slice(0, maxLength)}...`;
    }
    return url;
  }, []);

  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title; // Desired file name for the downloaded image

    // Create an anchor element
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Trigger the download by simulating a click event
    anchor.click();

    // Remove the anchor from the document
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className="flex flex-col md:flex-row mb-6 gap-5 p-4 border    bg-gray-100 rounded-lg">
      <Image
        src={url?.qr}
        className="object-contain ring ring-blue-500 self-start"
        alt={url?.title}
        width={150}
        height={100}
      />
      <Link
        className="flex  flex-col flex-1 col-gap-4"
        href={`link/${url?.id}`}
      >
        <span className="text-2xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer break-all">
          {process.env.NEXT_PUBLIC_HOST_URL}
          {url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span
          className="flex items-center gap-1 pt-2 hover:underline cursor-pointer text-blue-400 break-all"
          title={url?.original_url}
        >
          {" "}
          <LinkIcon className="p-1" />
          {truncateUrl(url?.original_url)}
        </span>
        <span className="flex items-center gap-1 flex-1 font-extralight text-sm">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-3">
        <Button>
          <Copy />
        </Button>
        <Button onClick={downloadImage}>
          <Download />
        </Button>
        <Button
          onClick={() => fnDelete().then(() => fetchUrls())}
          disabled={loadingDelete}
        >
          {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
