# Macro & Political Economy Dashboard

A single-page React + TypeScript dashboard that visualizes macroeconomic and political-economy themes with tabbed navigation and a dark, flat theme. All charts currently use dummy data but the data layer is structured to plug in live sources such as FRED, World Bank, WID, OECD, BEA, and OpenSecrets.

## Getting started

1. Install dependencies (you will need npm access):

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

3. Open the printed local URL to view the dashboard. Tabs switch client-side; no routing is required.

## Configuration

- Data mode is driven by the `VITE_USE_DUMMY_DATA` flag (default `true`). Set it to `false` in a `.env` file to enable live fetches once API keys are provided.
- API keys (placeholders for now):
  - `VITE_FRED_API_KEY` for US macro series.
  - World Bank, BEA, OECD/ILOSTAT, WID endpoints are stubbed and can be filled in the data hooks.

## Structure

- `src/App.tsx`: Header, tabs, and tab switching.
- `src/tabs/*Tab.tsx`: One component per tab (Overview, US Detail, Global Overview, Historical, Distribution & Power, Institutions & Policy, Global Political Economy, Macro 101).
- `src/components/`: Reusable UI elements (cards, KPIs, pills, chart wrapper, status chip, spinner).
- `src/data/dummyData.ts`: All placeholder series used across charts, plus Macro 101 text cards.
- `src/data/hooks.ts`: Typed hooks for each data domain with TODOs indicating where to plug in FRED, World Bank, BEA, OECD, WID, UNCTAD, and OpenSecrets sources.
- `src/utils/classifiers.ts`: Business-cycle classifier and regime summary helper.

## API mapping (intended live sources)

- **US macro**: FRED series for GDPC1 (real GDP), CPIAUCSL (inflation), UNRATE (unemployment), FEDFUNDS (policy rate), GFDEGDQ188S (debt/GDP).
- **Historical**: Build decadal averages from long-run GDP and CPI series (FRED/BEA) in `useHistoricalMacroData`.
- **Global macro**: World Bank indicators such as `NY.GDP.MKTP.KD.ZG` (GDP growth) and `FP.CPI.TOTL.ZG` (inflation) in `useGlobalMacroData`.
- **Distribution**: BEA labor share, WID inequality shares, OECD/ILOSTAT union density, and minimum wage indices in `useDistributionData`.
- **Institutions & policy**: BEA/OECD fiscal mix, tax structure, finance profit share, and static OpenSecrets lobbying JSON in `useInstitutionsData`.
- **Global political economy**: World Bank trade openness, UNCTAD FDI/portfolio flows, commodity reliance placeholders in `useGlobalPEData`.

## Testing

No automated tests are included yet. Run `npm run build` to verify the TypeScript build and Vite bundling once dependencies are installed.
