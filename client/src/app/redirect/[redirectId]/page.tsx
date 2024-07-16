"use client";

import { getLongUrl, storeVisits } from "@/app/actions";
import useFetch from "@/useFetch";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const RedirectPage = ({ params }: { params: { redirectId: string } }) => {
  const { redirectId } = params;
  const { loading, data, fn } = useFetch(getLongUrl, redirectId);

  const {
    loading: loadingStats,
    data: redirectUrl,
    fn: fnStats,
  } = useFetch(storeVisits, {
    id: data?.id,
    original_url: data?.original_url,
  });

  console.log();

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (redirectUrl?.redirectTo) {
    window.location.href = redirectUrl?.redirectTo;
  }

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectPage;
