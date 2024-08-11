/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { MdOutlineSwapVert } from "react-icons/md";
import { TokenWithBalance } from "../api/hooks/useTokens";
import { Button } from "./Button";
import axios from "axios";

const Swap = ({
  tokenBalances,
}: {
  tokenBalances: {
    totalBalance: number;
    tokens: TokenWithBalance[];
  } | null;
}) => {
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
  const [baseAmount, setBaseAmount] = useState<string>();
  const [quoteAmount, setQuoteAmount] = useState<string>();
  const [fetchingQuote, setFetchingQuote] = useState<boolean>(false);
  const [quoteResponse, setQuoteResponse] = useState(null);

  useEffect(() => {
    if (!baseAmount) {
      return;
    }

    const getQuoteAmount = async () => {
      setFetchingQuote(true);
      try {
        const res = await axios.get(
          `https://quote-api.jup.ag/v6/quote?inputMint=${
            baseAsset.mint
          }&outputMint=${quoteAsset.mint}&amount=${
            Number(baseAmount) * 10 ** baseAsset.decimals
          }&slippageBps=50`
        );

        setQuoteAmount(
          (Number(res.data.outAmount) / 10 ** quoteAsset.decimals).toString()
        );
        setQuoteResponse(res.data);
      } catch (error) {
        console.log("error fetching quote", error);
      } finally {
        setFetchingQuote(false);
      }
    };

    getQuoteAmount();
  }, [baseAmount]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Swap Tokens</h2>
        <h2 className="text-slate-400 flex items-center text-sm">
          Powered by &nbsp;
          <img
            src="https://jup.ag/svg/jupiter-logo.svg"
            alt="Jupiter"
            className="size-6"
          />
          &nbsp;<span className="text-slate-800 font-semibold">Jupiter</span>
        </h2>
      </div>
      <SwapInputRow
        onSelect={(asset) => setBaseAsset(asset)}
        selectedToken={baseAsset}
        title="You pay"
        additionalClasses="rounded-t-lg border-b-0"
        subtitle={`Current Balance: ~${
          tokenBalances?.tokens.find((x) => x.name === baseAsset.name)?.balance
        } ${baseAsset.name}`}
        amount={baseAmount}
        onAmountChange={(value) => setBaseAmount(value)}
      />
      <div className="flex justify-center group">
        <div
          className="border-2 border-slate-400 group-hover:border-slate-800 max-w-fit rounded-full hover:cursor-pointer absolute -mt-5 bg-white p-2"
          onClick={() => {
            let tempBaseAsset = baseAsset;
            setBaseAsset(quoteAsset);
            setQuoteAsset(tempBaseAsset);
          }}
        >
          <MdOutlineSwapVert className="size-6 text-lg text-slate-400 group-hover:text-slate-800" />
        </div>
      </div>
      <SwapInputRow
        onSelect={(asset) => setQuoteAsset(asset)}
        selectedToken={quoteAsset}
        title="You receive"
        additionalClasses="rounded-b-lg"
        subtitle={`Current Balance: ~${
          tokenBalances?.tokens.find((x) => x.name === quoteAsset.name)?.balance
        } ${quoteAsset.name}`}
        amount={fetchingQuote ? "Fetching ..." : quoteAmount}
        onAmountChange={(value) => setQuoteAmount(value)}
        inputDisabled={true}
      />

      <div className="flex justify-end mt-6">
        <Button
          onClick={async () => {
            try {
                const res = await axios.post("/api/swap", { quoteResponse });
                if(res.data.txid) {
                    alert("Swap successful!");
                }
            } catch (error) {
                console.log('error during swapping', error);
                alert("Error: Swap successful");
            }
          }}
        >
          Swap
        </Button>
      </div>
    </div>
  );
};

export default Swap;

const SwapInputRow = ({
  onSelect,
  selectedToken,
  title,
  additionalClasses = "",
  subtitle,
  amount,
  onAmountChange,
  inputDisabled,
}: {
  onSelect: (asset: TokenDetails) => void;
  selectedToken: TokenDetails;
  title: string;
  additionalClasses?: string;
  subtitle: string;
  amount?: string;
  onAmountChange?: (value: string) => void;
  inputDisabled?: boolean;
}) => {
  return (
    <div
      className={`border-2 border-slate-400 p-6 focus-within:border-slate-600 ${additionalClasses}`}
    >
      <span className="text-md font-semibold">{title}:</span>
      <div className="flex justify-between my-2">
        <div className="flex flex-col w-1/3">
          <div className="w-1/2">
            <AssetSelector selectedToken={selectedToken} onSelect={onSelect} />
          </div>
        </div>
        <div className="text-4xl w-2/3">
          <input
            type="text"
            className="focus:outline-none text-end"
            placeholder="0"
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            disabled={inputDisabled}
          />
        </div>
      </div>
      <span className="text-slate-400 text-sm">{subtitle}</span>
    </div>
  );
};

const AssetSelector = ({
  selectedToken,
  onSelect,
}: {
  selectedToken: TokenDetails;
  onSelect: (asset: TokenDetails) => void;
}) => {
  return (
    <div>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={(e) => {
          console.log(e.target.value);
          const selectedToken = SUPPORTED_TOKENS.find(
            (t) => t.name === e.target.value
          );
          if (selectedToken) {
            onSelect(selectedToken);
          }
        }}
      >
        {SUPPORTED_TOKENS.map((token) => (
          <option
            value={token.name}
            key={token.mint}
            selected={selectedToken.name === token.name}
          >
            {token.name}
          </option>
        ))}
      </select>
    </div>
  );
};
