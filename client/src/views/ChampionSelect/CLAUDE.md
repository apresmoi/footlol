# ChampionSelect View

**Stage:** `CHAMPION_SELECT`

Grid of champion portraits. Disabled champions (already picked) have visual styling. Selecting calls `context.requestChampionSelect(champion)`. Ready button to confirm.

## Subcomponents

- `ChampionPool.tsx` — grid of selectable champions, props: `{ champions, disabledChampions, onClick }`
- `Chat.tsx` — placeholder, not fully implemented

## Assets

Champion images from LoL CDN: `ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/{name}.png`
