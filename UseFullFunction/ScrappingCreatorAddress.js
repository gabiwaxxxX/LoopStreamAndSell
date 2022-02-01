import JSSoup from "jssoup";
import Xray from "x-ray";
import Web3 from "web3";
import axios from "axios";
import decodeConstructorArgs from "canoe-solidity";
import { spawn } from "child_process";
import cheerio from "cheerio";
import pretty from "pretty";
import fs from "fs";

async function ScrappingCreatorAddress(address) {
  const WalletCreator = await scrapSteam(address);
  return WalletCreator;
}

const fethHtml = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};

const scrapSteam = async (address) => {
  const steamUrl = `https://snowtrace.io/address/${address}`;

  const html = await fethHtml(steamUrl);

  const selector = cheerio.load(html);

  const searchResults = selector("body").find(
    'div[class="wrapper"] > main[id="content"] > div[id="ContentPlaceHolder1_divSummary"] > div[class="row mb-4"] > div[id="ContentPlaceHolder1_cardright"] > div[class="card h-100"] > div[class="card-body"] > div[id="ContentPlaceHolder1_trContract"] > div[class="row align-items-center"] >  div[class="col-md-8"] > a '
  );

  console.log("Contract Creator Address 2: ", searchResults.html());
  //console.log(a.html());

  return searchResults.html();
};

export default ScrappingCreatorAddress;
