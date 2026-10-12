import web3 from './metamask';
import { CAKE_ROUTER_ABI ,CAKE_TESTNET_ROUTER,CAKE_MAINNET_ROUTER } from './pancake.config'

let pancake_swap_contract="";
if(web3 !== undefined && web3 !==""){
    pancake_swap_contract = new web3.eth.Contract(CAKE_ROUTER_ABI,CAKE_TESTNET_ROUTER,CAKE_MAINNET_ROUTER);
}
export default pancake_swap_contract;