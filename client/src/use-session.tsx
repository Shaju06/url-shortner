import { useState, useEffect } from "react";
import { createSuperbaseClient } from "./utils/superbase/client";

const userSession = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const superbase = await createSuperbaseClient();
      const session = await superbase.auth.getSession();
      setSession(session.data.session);
      setIsLoading(false);
    };
    getSession();
  }, []);

  return { session, isLoading };
};

export default userSession;
