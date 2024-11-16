"use client";

import { getUrl, getVisitedUrls } from "@/app/actions";
import useSession from "@/useSession";
import useFetch from "@/useFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Location from "./LocationStats";
import Device from "./DeviceStats";
import Loader from "./Loader";

const LinkDetails = ({ id }: { id: string }) => {
  const { session } = useSession();

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: session?.user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getVisitedUrls, { urlIds: [id] });

  const link = useMemo(() => {
    return url?.custom_url ? url?.custom_url : url?.short_url;
  }, [url]);

  useEffect(() => {
    if (session) {
      fn();
      fnStats();
    }
  }, [fn, fnStats]);

  if (loadingStats || loading) {
    return <Loader />;
  }
  return (
    <div className="container flex flex-col gap-8 sm:flex-row justify-between mt-6 mb-6">
      <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
        <span className="text-4xl hover:underline cursor-pointer">
          {url?.title}
        </span>
        <Link
          className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer break-all"
          href={`${process.env.NEXT_PUBLIC_HOST_URL}${link}`}
          target="_blank"
        >
          {process.env.NEXT_PUBLIC_HOST_URL}
          {link}
        </Link>
        <Link
          className="flex items-center gap-1 hover:underline cursor-pointer break-all"
          href={url?.original_url || ""}
          target="_blank"
        >
          <LinkIcon className="p-1" />

          {url?.original_url}
        </Link>
        <span className="flex items-end font-extralight text-sm">
          {new Date(url?.created_at).toLocaleString()}
        </span>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_HOST_URL}${link}`
              )
            }
          >
            <Copy />
          </Button>
          {/* <Button>
            <Download />
          </Button>
          <Button>
            <Trash />
          </Button> */}
        </div>
        <Image
          className="ring ring-blue-500"
          src={url?.qr}
          width={200}
          height={200}
          alt={url?.title}
        />
      </div>
      <Card className="sm:w-4/5 ring ring-blue-500 text-center">
        <CardHeader className="text-2xl font-extrabold ">Statistics</CardHeader>
        {Array.isArray(stats) && stats.length ? (
          <CardContent className="flex flex-col gap-6 ">
            <Card className="ring ring-blue-500">
              <CardHeader>
                <CardTitle>Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{stats?.length}</p>
              </CardContent>
            </Card>

            <CardTitle>Location Data</CardTitle>
            <Location stats={stats} />
            <CardTitle>Device Info</CardTitle>
            <Device stats={stats} />
          </CardContent>
        ) : (
          <CardContent>
            {loadingStats === false
              ? "No Statistics yet"
              : "Loading Statistics.."}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default LinkDetails;
