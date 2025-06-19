import { useQuery } from "@tanstack/react-query";


export const useTokenInfos = () =>
    useQuery({
        queryKey: ["tokeninfo"],
        queryFn: async () => {
            async function fetchJupiterTokens() {
                const tokenInfos = await (
                    await fetch("https://token.jup.ag/strict")
                ).json();

                const tokenInfoMap = tokenInfos.reduce((acc, tokenInfo) => {
                    if (tokenInfo.chainId === 101) {
                        return acc.set(tokenInfo.address, tokenInfo);
                    }
                    return acc;
                }, new Map());

                return { tokenInfoMap, tokenInfos };
            }

            const { tokenInfoMap, tokenInfos } = await fetchJupiterTokens();

            return { tokenInfoMap, tokenInfos };
        },
    });