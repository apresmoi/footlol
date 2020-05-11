import React from 'react'


const ChampionPool = ({ champions, disabledChampions, onClick }) => {
  return <div className="champion-pool">
    {champions.map(champion => <ChampionComponent onClick={onClick} champion={champion} disabled={disabledChampions.includes(champion)} />)}
  </div>
}

const ChampionComponent = ({ champion, onClick, disabled }) => {
  const handleClick = () => {
    onClick(champion)
  }
  return <div className={`champion ${disabled ? 'disabled' : ''}`} onClick={handleClick}>
    <img src={`http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${champion}.png`} />
  </div>
}


export default ChampionPool