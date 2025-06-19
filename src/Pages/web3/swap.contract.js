import web3 from './metamask';
import { SWAP_ROUTER_ABI, SWAP_MAINNET_ROUTER,SWAP_TESTNET_ROUTER} from './swap.config'

// const address=TODO_LIST_ADDRESS;
// const abi = TODO_LIST_ABI

let swap_contract='';
if(web3 !== undefined && web3 !=="") {
    swap_contract= new web3.eth.Contract(SWAP_ROUTER_ABI,SWAP_MAINNET_ROUTER,SWAP_TESTNET_ROUTER);
}
export default swap_contract;
