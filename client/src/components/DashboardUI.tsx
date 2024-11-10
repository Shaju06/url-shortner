"use client";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import CreateNewLink from "./CreateNewLink";
import useSession from "@/use-session";
import useFetch from "@/useFetch";
import { getUrl, getUrls, getVisitedUrls } from "@/app/actions";
import { useEffect, useMemo, useState } from "react";
import LinkDetails from "./LinkDetails";
import LinkCard from "./LinkCard";

const DashboardUI = () => {
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    loading,
    error,
    data: urls,
    fn: fnUrls,
  } = useFetch(getUrls, session?.user?.id);

  const {
    loading: loadingVisits,
    data: visits,
    fn: fnVisits,
  } = useFetch(
    getVisitedUrls,
    urls?.map((url) => url.id)
  );

  console.log(visits, "fdfsdf");

  useEffect(() => {
    if (session?.user?.id) fnUrls();
  }, [fnUrls, session?.user?.id]);

  const filteredUrls = useMemo(
    () =>
      urls?.filter((url) =>
        url.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, urls]
  );

  return (
    <div className="flex flex-col gap-4 mt-6 container">
      <div className="grid grid-cols-2 gap-4">
        <Card className="">
          <CardHeader>Links</CardHeader>
          <CardContent>{urls?.length}</CardContent>
        </Card>
        <Card>
          <CardHeader>Total links visited</CardHeader>
          <CardContent>{visits?.length}</CardContent>
        </Card>
      </div>
      <div className="flex justify-between mt-10">
        <h2>Links</h2>
        <CreateNewLink />
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter for search...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute top-2 right-2 p-1 cursor-pointer" />
      </div>
      {filteredUrls?.length ? (
        filteredUrls.map((url, i) => (
          <LinkCard key={url?.id} url={url} fetchUrls={fnUrls} />
        ))
      ) : (
        <div className="text-center mt-10 text-2xl font-extralight">
          No data to show
        </div>
      )}
    </div>
  );
};

export default DashboardUI;
