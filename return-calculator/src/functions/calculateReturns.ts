import API_KEY from "../env";

interface InvestmentData {
  date: string;
  amount: string;
}

interface HistoricalData {
  date: string;
  open: number;
  close: number;
}

interface APIResponse {
  historical: HistoricalData[];
}

async function fetchHistoricalData(from: string): Promise<APIResponse> {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/historical-price-full/SPY?from=${from}&apikey=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch SPY data");
  }
  return response.json();
}

export async function calculateReturns(
  investments: InvestmentData[]
): Promise<number> {
  try {
    // Find the oldest date from investments
    const oldestDate = investments.reduce(
      (oldest, inv) => (inv.date < oldest ? inv.date : oldest),
      investments[0].date
    );

    // Fetch historical data
    const data = await fetchHistoricalData(oldestDate);

    // Create a map of date to open price for quick lookup
    const priceMap = new Map(
      data.historical.map((item) => [item.date, item.open])
    );

    // Get today's price (first item in the historical array)
    const currentPrice = data.historical[0].close;

    console.log(`Current price: ${currentPrice}`);

    let totalValue = 0;
    investments.forEach((inv) => {
      const purchasePrice = priceMap.get(inv.date);
      if (!purchasePrice) {
        throw new Error(`No price data found for date: ${inv.date}`);
      }
      const sharesBought = parseFloat(inv.amount) / purchasePrice;
      const addedValue = sharesBought * currentPrice;
      console.log(
        `Adding ${addedValue} for date ${inv.date} and amount ${inv.amount}`
      );
      totalValue += addedValue;
    });

    return totalValue;
  } catch (error) {
    console.error("Error calculating returns:", error);
    throw new Error("Failed to calculate returns");
  }
}

export default calculateReturns;
