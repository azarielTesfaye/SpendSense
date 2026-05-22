import { ApiError } from "@/lib/api";
import { getMarketItems } from "@/lib/market";
import {
  getInflationData,
  getMarketForecasts,
  getPriceAverages,
  getPriceTrends,
} from "@/lib/market-data";
import { LivePriceClient } from "./live-price-client";

type PageProps = {
  searchParams?: Promise<{
    city?: string;
    item_id?: string;
    range?: string;
  }>;
};

function getFromDate(range: string | undefined) {
  const d = new Date();
  if (range === "1M") d.setMonth(d.getMonth() - 1);
  else if (range === "6M") d.setMonth(d.getMonth() - 6);
  else if (range === "1Y") d.setFullYear(d.getFullYear() - 1);
  else d.setMonth(d.getMonth() - 3);
  return d.toISOString().slice(0, 10);
}

export default async function PriceTrendsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const city = params?.city || "Addis Ababa";
  const range = params?.range || "3M";

  try {
    const [items, averages] = await Promise.all([
      getMarketItems(),
      getPriceAverages(),
    ]);
    const parsedItemId = Number.parseInt(params?.item_id ?? "", 10);
    const selectedItemId = Number.isFinite(parsedItemId)
      ? parsedItemId
      : items[0]?.id ?? null;

    const [inflation, trends, forecasts] =
      selectedItemId === null
        ? [null, [], []]
        : await Promise.all([
            getInflationData({
              city,
              item_id: selectedItemId,
              period: "month",
            }).catch(() => null),
            getPriceTrends({
              item_id: selectedItemId,
              city,
              from_date: getFromDate(range),
            }).catch(() => []),
            getMarketForecasts({
              item_id: selectedItemId,
              city,
              forecast_weeks: 4,
            }).catch(() => []),
          ]);

    return (
      <LivePriceClient
        averages={averages}
        chartCity={city}
        chartForecasts={forecasts}
        chartInflation={inflation}
        chartRange={range}
        chartTrends={trends}
        initialError={null}
        items={items}
        lastUpdated={new Date().toISOString()}
        selectedChartItemId={selectedItemId}
      />
    );
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to load market data. The server might be down or unreachable.";

    return (
      <LivePriceClient
        averages={[]}
        chartCity={city}
        chartForecasts={[]}
        chartInflation={null}
        chartRange={range}
        chartTrends={[]}
        initialError={message}
        items={[]}
        lastUpdated={new Date().toISOString()}
        selectedChartItemId={null}
      />
    );
  }
}
