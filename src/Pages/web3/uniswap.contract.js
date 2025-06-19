import web3 from './metamask';
import { UNI_ROUTER_ABI, UNI_MAINNET_ROUTER,UNI_TESTNET_ROUTER} from './uniswap.config'

// const address=TODO_LIST_ADDRESS;
// const abi = TODO_LIST_ABI

let uniswap_contract='';
if(web3 !== undefined && web3 !=="") {
    uniswap_contract= new web3.eth.Contract(UNI_ROUTER_ABI,UNI_MAINNET_ROUTER,UNI_TESTNET_ROUTER);
}
export default uniswap_contract;
