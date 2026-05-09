function setDefaultDates() {
  const today = new Date();
  const format = (d) => d.toISOString().slice(0, 10);

  const historyEnd = new Date(today);
  const historyStart = new Date(today);
  historyStart.setMonth(historyStart.getMonth() - 6);

  const forwardStart = new Date(today);
  const forwardEnd = new Date(today);
  forwardEnd.setMonth(forwardEnd.getMonth() + 3);

  document.getElementById('historyStart').value = format(historyStart);
  document.getElementById('historyEnd').value = format(historyEnd);
  document.getElementById('forwardStart').value = format(forwardStart);
  document.getElementById('forwardEnd').value = format(forwardEnd);
}

function mockEvaluateStrategy(params) {
  const baseTrades = params.timeframe === '15m' ? 120 : 90;
  const emaFactor = Math.max(0.8, 1.15 - Math.abs(params.emaPeriod - 20) * 0.01);
  const filterBoost = params.priceActionFilter === 'on' ? 2.5 : 0;

  const pastWinRate = Math.min(75, Math.max(35, 53 + (emaFactor - 1) * 20 + filterBoost));
  const futureWinRate = Math.min(72, Math.max(33, pastWinRate - 1.8));

  return {
    past: {
      trades: Math.round(baseTrades * emaFactor),
      winRate: pastWinRate.toFixed(1) + '%',
      pf: (1.1 + (pastWinRate - 50) / 40).toFixed(2)
    },
    future: {
      trades: Math.round(baseTrades * 0.7 * emaFactor),
      winRate: futureWinRate.toFixed(1) + '%',
      expectancy: ((futureWinRate - 50) / 100).toFixed(2) + 'R'
    }
  };
}

function run() {
  const params = {
    symbol: document.getElementById('symbol').value,
    emaPeriod: Number(document.getElementById('emaPeriod').value),
    timeframe: document.getElementById('timeframe').value,
    tpBuffer: Number(document.getElementById('tpBuffer').value),
    slBuffer: Number(document.getElementById('slBuffer').value),
    priceActionFilter: document.getElementById('priceActionFilter').value,
    historyStart: document.getElementById('historyStart').value,
    historyEnd: document.getElementById('historyEnd').value,
    forwardStart: document.getElementById('forwardStart').value,
    forwardEnd: document.getElementById('forwardEnd').value
  };

  const result = mockEvaluateStrategy(params);

  document.getElementById('pastTrades').textContent = result.past.trades;
  document.getElementById('pastWinRate').textContent = result.past.winRate;
  document.getElementById('pastPf').textContent = result.past.pf;

  document.getElementById('futureTrades').textContent = result.future.trades;
  document.getElementById('futureWinRate').textContent = result.future.winRate;
  document.getElementById('futureExpectancy').textContent = result.future.expectancy;
}

setDefaultDates();
document.getElementById('runBtn').addEventListener('click', run);
