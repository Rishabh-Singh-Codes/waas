import { TokenDetails } from "@/app/lib/tokens";
import axios from "axios";
import { useEffect, useState } from "react";

export interface TokenWithBalance extends TokenDetails {
  balance: string;
  usdBalance: string;
}

export function useTokens(address: string) {
  const [tokenBalances, setTokenBalances] = useState<{
    totalBalance: number;
    tokens: TokenWithBalance[];
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // axios.get(`/api/tokens?address=${address}`).then((res) => {
    //   setTokenBalances(res.data);
    //   setLoading(false);
    // });

    const fetchTokenBalances = async () => {
      try {
        const res = await axios.get(`/api/tokens?address=${address}`);
        setTokenBalances(res.data);
      } catch (error) {
        console.log("error in fetchTokenBalances", error);

        setTokenBalances({
          totalBalance: 0,
          tokens: [],
        });
      } finally{ 
        setLoading(false);
      }
    };

    fetchTokenBalances();
  }, [address]);

  return {
    loading,
    tokenBalances,
  };
}
