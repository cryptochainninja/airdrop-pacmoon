var web3;
var account;
const ICO = "0x024a9d0845d20d5690ca188929034b7fdaeeb0f2";
const USDC = "0xe9e7cea3dedca5984780bafc599bd69add087d56";
const tokenAddress = "0xd065ca6460ae6d379c93ec0422084c2bc7048d77";
const tokenSymbol = "3WM";
const tokenDecimals = 10;
const tokenImage = "https://spantale.io/assets//img/spantale-token32x32.png";

async function Connect() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  account = accounts[0];
  const provider = await detectEthereumProvider();
  $("#invest_button").prop("disabled", false);
  web3 = new Web3(provider);
}

async function BuyTokens() {
  // console.log(Web3.eth.accounts);
  let investAmount = document.getElementById("invest_amount").value;
  if (investAmount >= 100) {
    //Connect Wallet

    const usdcContract = new web3.eth.Contract(erc20ABI, USDC);
    const icoContract = new web3.eth.Contract(icoABI, ICO);
    const usdcDecimal = await usdcContract.methods.decimals().call();
    const allowance = await usdcContract.methods.allowance(account, ICO).call();

    //Approve token to ICO contract
    if (allowance == 0) {
      await usdcContract.methods.approve(ICO, ethers.constants.MaxUint256).send({ from: account });
    }

    investAmount = ethers.BigNumber.from(investAmount);
    let decimal = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(usdcDecimal));
    investAmount = investAmount.mul(decimal);
    console.log(investAmount.toString());
    // Invest
    await icoContract.methods.buyTokens(investAmount.toString()).send({ from: account });

    // Add token to wallet
    // await ethereum.request({
    //     method: 'wallet_watchAsset',
    //     params: {
    //       type: 'ERC20',
    //       options: {
    //         address: tokenAddress,
    //         symbol: tokenSymbol,
    //         decimals: tokenDecimals,
    //         image: tokenImage
    //       },
    //     },
    // });
  }
}
