# LoopStreamAndSell
This repo is a v1 made in December 2021
> There is a need to change the architecture of the code and how it works. Need to switch to TS and switch from ether.js library to web3.js<br/><br/>

Bot that allows to follow in real time the actions of an address: ours and to trigger a swap token event. Then there is determination of the dev wallet of the token thus bought and a stream of these actions. If the dev wallet performs a scam type action the bot will automatically sell the token we just swapped

**getWalletBalance.js** Allows to find the total amount that an address has of token X <br/><br/>
**ScrappingCreatorAddress.js** Find the address that created the token X<br/><br/>
**sellYourToken.js** Takes the amount that the user has of token X and the router on which he bought the token X and sells the totality for the token Y that he had put before <br/><br/>
**TriggerEventAdress.js** Stream transactions made by an address A: <br/>
Two cases of use: <br/>
* If A is the user: if A buys a token X on a router B (swap) it will automatically approve the expenditure of the token X on the router B.<br/>
* If A is the address which created the token X it will look at its transactions and check if it does not carry out scammy transactions (approve the LP on the router B (rugpull), sell the token X (soft rug))<br/><br/>
