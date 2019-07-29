const iWanClient = require('iwan-sdk');
const sleep = require('ko-sleep');
const pf = require('promisefy-util');
const myKey = require('./key.json');

let YourApiKey = myKey.apiKey;
let YourSecretKey = myKey.secretKey;

//Subject to https://iwan.wanchain.org
let option = {
  url: "apitest.wanchain.org",
  port: 8443,
  flag: "ws",
  version: "v3"
};

async function main() {
  let apiClient = null;
  try {
    apiClient = new iWanClient(YourApiKey, YourSecretKey, option);
    while (true) {
      await sleep(2000);
      let blockNumber = await pf.promisefy(apiClient.getBlockNumber, ['wan'], apiClient);
      let epID = await pf.promisefy(apiClient.getEpochID, ['wan'], apiClient);
      console.log(blockNumber, epID);
      let epLeader = await pf.promisefy(apiClient.getEpochLeadersByEpochID, ['wan', epID+1], apiClient);
      console.log(epLeader);
      let rnp = await pf.promisefy(apiClient.getRandomProposersByEpochID, ['wan', epID+1], apiClient);
      console.log(rnp);
    }
  } catch (error) {
    console.log(error);
  }

  if (apiClient) {
    apiClient.close();
  }

}

main();