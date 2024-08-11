/* eslint-disable @next/next/no-img-element */
import { TokenWithBalance } from "../api/hooks/useTokens";

const TokenList = ({tokens}: {tokens: TokenWithBalance[]}) => {
    return (
        <div>
            {tokens.map(token => <TokenRow token={token} key={token.mint}/>)}
        </div>
    )
}

export default TokenList;

const TokenRow = ({token}: {token: TokenWithBalance}) => {
    return (
        <div className="flex justify-between w-full items-center my-4">
            <div className="flex items-center flex-start">
                <img src={token.image} alt={token.name} className="size-12 rounded-full"/>
                <div className="flex flex-col ml-4">
                    <span className="text-lg font-bold">{token.name}</span>
                    <span className="text-sm text-slate-400">1 {token.name} ≈ {Number(token.price).toFixed(2)}</span>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="text-lg font-bold text-end">${Number(token.usdBalance).toFixed(2)}</div>
                <div className="text-sm text-slate-400">{Number(token.balance).toFixed(3)} {token.name}</div>
            </div>
        </div>
    )
}