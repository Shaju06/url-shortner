import { useState, useEffect } from "react";
import { supabase } from "./utils/superbase/client";

const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };
    fetchSession();
  }, []);

  return { session, isLoading };
};

export default useSession;
