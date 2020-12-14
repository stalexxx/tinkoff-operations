import OpenAPI, { MarketInstrument, Operation } from '@tinkoff/invest-openapi-js-sdk';
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
  const { operations } = await api.operations({
    from: '2019-08-19T18:38:33.131642+03:00',
    to: '2021-08-19T18:48:33.131642+03:00',
    figi,
  });

  const sumFn = (acc: number, x: number): number => acc + x;

  const payments = operations.map(o => o.payment)
  const sum = payments.reduce(sumFn, 0)

  function matchNumber(o: Operation): number {
    switch (o.operationType) {
      case "Buy":
      case "BuyCard":
         return o.trades?.map(o => o.quantity).reduce(sumFn) || 0
    
      case "Sell":
          return -(o.trades?.map(o => o.quantity).reduce(sumFn) || 0)
      default:
        return 0
    }
    
  }

  const qty = operations
  .map(matchNumber)
  .reduce(sumFn, 0)
  console.log(`Количество: ${qty}`)
  qty != 0 ? console.log(`Среднее: ${sum/qty}`) : console.log(`Прибыль(убыток): ${sum}`)

  // console.log(qty)
  
})();
