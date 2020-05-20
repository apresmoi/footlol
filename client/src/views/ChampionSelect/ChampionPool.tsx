import React from 'react'
import { Champion } from '../../store/types'


const ChampionPool = ({ champions, disabledChampions, onClick }) => {
  return <div className="champion-pool-container">
    <div className="champion-select-header">
      Select a Champion and press READY
    </div>
    <div className="champion-pool">
      {champions.map(champion => <ChampionComponent onClick={onClick} champion={champion} disabled={disabledChampions.includes(champion.name)} />)}
    </div>
  </div>
}

const ChampionComponent = ({ champion, onClick, disabled }: { champion: Champion, onClick: (champion: string) => void, disabled?: boolean }) => {
  const handleClick = () => {
    onClick(champion.name)
  }
  return <div className={`champion ${disabled ? 'disabled' : ''}`} onClick={handleClick}>
    <img src={`${window.location.protocol}//ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${champion.name}.png`} />
  </div>
}


export default ChampionPool