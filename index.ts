import OpenAPI, { MarketInstrument } from '@tinkoff/invest-openapi-js-sdk';
const apiURL = 'https://api-invest.tinkoff.ru/openapi';
// const sandboxApiURL = 'https://api-invest.tinkoff.ru/openapi/sandbox/';
const socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';

//Insert your token here
const secretToken = process.env.API_TOKEN; // токен для боевого api


// const sandboxToken = process.env.SANDBOX_TOKEN; // токен для сандбокса
const api = new OpenAPI({ apiURL: apiURL, secretToken: secretToken as string, socketURL });

!(async function run() {
  const marketInstrument = await api.searchOne({ ticker: 'NOK' }) as MarketInstrument;
  const { figi } = marketInstrument;
  const operations = await api.operations({
    from: '2019-08-19T18:38:33.131642+03:00',
    to: '2021-08-19T18:48:33.131642+03:00',
    figi,
  });

  const payments = operations.operations.map(x => x.payment)
  const sum = payments.reduce((acc, x) => acc + x, 0)
  console.log(sum)
  
  api.candle({ figi }, (x) => {
    console.log(x.h);
  });
})();
