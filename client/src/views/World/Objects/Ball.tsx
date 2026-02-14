import React from 'react';
import { Ball } from '../../../store/types'

const starPoints = (outer: number, inner: number, spikes: number): string => {
  const points: string[] = []
  const step = Math.PI / spikes
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = i * step - Math.PI / 2
    points.push(`${Math.cos(angle) * radius},${Math.sin(angle) * radius}`)
  }
  return points.join(' ')
}

const BallComponent = (props: { ball: Ball }) => {
  const { ball } = props
  const states = ball.states || []
  const frozen = states.some((state) => state.type === 'frozen')
  const stunned = states.some((state) => state.type === 'stunned')
  const slowed = states.some((state) => state.type === 'slowed')

  return <g
    className="ball"
    transform={`translate(${ball.position.x}, ${ball.position.y}) rotate(${ball.angle})`}
  >
    <defs>
      <pattern id={`ball_image`} x="-5%" y="-5%" height="105%" width="105%"
        viewBox="0 0 120 120">
        <svg height="120px"
          viewBox="0 0 470 470" width="120px" xmlns="http://www.w3.org/2000/svg">
          <path d="m240 0c-132.546875 0-240 107.453125-240 240s107.453125 240 240 240 240-107.453125 240-240c-.148438-132.484375-107.515625-239.851562-240-240zm8.566406 69.191406 83.433594-33.351562c9.46875 4.285156 18.628906 9.222656 27.414062 14.777344l.21875.136718c8.632813 5.46875 16.882813 11.519532 24.695313 18.109375l.671875.585938c3.503906 2.984375 6.910156 6.074219 10.222656 9.261719.417969.410156.855469.800781 1.273438 1.21875 3.472656 3.390624 6.835937 6.886718 10.089844 10.484374.269531.304688.527343.625.796874.929688 2.855469 3.199219 5.601563 6.511719 8.265626 9.878906.640624.800782 1.28125 1.601563 1.902343 2.402344 2.890625 3.742188 5.6875 7.550781 8.328125 11.480469l-16.632812 70.703125-81.832032 27.28125-78.828124-63.074219zm-186.125 34.480469c.621094-.800781 1.253906-1.601563 1.894532-2.398437 2.632812-3.339844 5.355468-6.597657 8.167968-9.777344.304688-.335938.585938-.679688.886719-1.015625 3.234375-3.605469 6.582031-7.097657 10.050781-10.480469.398438-.390625.796875-.800781 1.214844-1.160156 3.285156-3.167969 6.664062-6.238282 10.136719-9.207032l.800781-.671874c7.742188-6.542969 15.914062-12.554688 24.460938-18l.3125-.199219c8.734374-5.542969 17.835937-10.472657 27.25-14.761719l83.816406 33.191406v80.800782l-78.832032 63.0625-81.832031-27.230469-16.632812-70.703125c2.664062-3.921875 5.429687-7.722656 8.304687-11.449219zm-9.640625 259.089844c-2.351562-3.585938-4.601562-7.238281-6.746093-10.960938l-.519532-.898437c-2.132812-3.703125-4.152344-7.46875-6.054687-11.292969l-.066407-.121094c-4.007812-8.046875-7.527343-16.328125-10.535156-24.800781v-.078125c-1.421875-4-2.71875-8.097656-3.917968-12.21875l-.433594-1.519531c-1.097656-3.871094-2.09375-7.785156-2.984375-11.742188-.078125-.386718-.175781-.753906-.253907-1.136718-1.964843-8.9375-3.375-17.984376-4.226562-27.097657l48.839844-58.605469 81.265625 27.085938 23.585937 94.335938-38.753906 51.5625zm240.472657 94.78125c-4 .992187-8.105469 1.847656-12.210938 2.617187-.574219.113282-1.160156.207032-1.734375.3125-3.496094.625-7.03125 1.160156-10.574219 1.597656-.945312.121094-1.882812.25-2.824218.363282-3.289063.382812-6.609376.671875-9.9375.910156-1.046876.070312-2.082032.175781-3.128907.242188-4.253906.261718-8.542969.414062-12.863281.414062-3.957031 0-7.890625-.105469-11.800781-.3125-.472657 0-.925781-.078125-1.398438-.113281-3.480469-.199219-6.945312-.460938-10.402343-.796875l-.398438-.074219c-7.574219-.820313-15.105469-2.023437-22.558594-3.597656l-47.320312-74.089844 38.144531-50.863281h111.46875l38.769531 51.199218zm165.496093-169.542969c-.082031.382812-.175781.753906-.257812 1.136719-.894531 3.953125-1.890625 7.867187-2.984375 11.742187l-.429688 1.519532c-1.203125 4.121093-2.496094 8.203124-3.921875 12.21875v.078124c-3.007812 8.472657-6.523437 16.753907-10.535156 24.800782l-.066406.121094c-1.914063 3.828124-3.929688 7.59375-6.054688 11.292968l-.519531.898438c-2.132812 3.734375-4.378906 7.378906-6.734375 10.945312l-78.929687 12.445313-39.023438-51.519531 23.574219-94.3125 81.265625-27.085938 48.839844 58.605469c-.847657 9.117187-2.257813 18.171875-4.222657 27.113281zm0 0" />
        </svg>
      </pattern>
      <radialGradient id="ball_frozen_core" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#e9fbff" stopOpacity={0.9} />
        <stop offset="50%" stopColor="#9cdef8" stopOpacity={0.44} />
        <stop offset="100%" stopColor="#73c5f2" stopOpacity={0.08} />
      </radialGradient>
      <radialGradient id="ball_frozen_halo" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#daf6ff" stopOpacity={0.32} />
        <stop offset="100%" stopColor="#7ecbf8" stopOpacity={0} />
      </radialGradient>
      <linearGradient id="ball_frozen_sheen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.78} />
        <stop offset="45%" stopColor="#cfeeff" stopOpacity={0.28} />
        <stop offset="100%" stopColor="#9fd8fb" stopOpacity={0} />
      </linearGradient>
      <radialGradient id="ball_slow_halo" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#b2f5ff" stopOpacity={0.3} />
        <stop offset="70%" stopColor="#66cbe9" stopOpacity={0.2} />
        <stop offset="100%" stopColor="#2a7da8" stopOpacity={0} />
      </radialGradient>
    </defs>

    <circle cx={0} cy={0} r={12} fill={"white"} />
    <circle cx={0} cy={0} r={12} fill={`url(#ball_image)`} />

    {frozen && <>
      <circle cx={0} cy={0} r={15.6} fill="url(#ball_frozen_halo)" />
      <circle cx={0} cy={0} r={12.4} fill="url(#ball_frozen_core)" />
      <ellipse cx={-2.6} cy={-4.4} rx={9.2} ry={4.9} fill="url(#ball_frozen_sheen)" transform="rotate(-22)" />
      <circle cx={0} cy={0} r={13.7} fill="none" stroke="rgba(208, 246, 255, 0.86)" strokeWidth={1.08} />
      <circle cx={0} cy={0} r={14.8} fill="none" stroke="rgba(206, 238, 255, 0.7)" strokeWidth={0.9} strokeDasharray="1.2 4.2" />
      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 0 0" to="360 0 0" dur="2.2s" repeatCount="indefinite" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
          const rad = angle * Math.PI / 180
          const x = Math.cos(rad) * 15.1
          const y = Math.sin(rad) * 15.1
          const p1x = Math.cos(rad + 0.18) * 10.3
          const p1y = Math.sin(rad + 0.18) * 10.3
          const p2x = Math.cos(rad - 0.18) * 10.3
          const p2y = Math.sin(rad - 0.18) * 10.3
          return (
            <polygon
              key={index}
              points={`${p1x},${p1y} ${x},${y} ${p2x},${p2y}`}
              fill="rgba(218, 248, 255, 0.74)"
              stroke="rgba(241, 253, 255, 0.82)"
              strokeWidth={0.46}
            />
          )
        })}
      </g>
      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="360 0 0" to="0 0 0" dur="3.6s" repeatCount="indefinite" />
        {[30, 120, 210, 300].map((angle, index) => {
        const rad = angle * Math.PI / 180
          const x = Math.cos(rad) * 13.9
          const y = Math.sin(rad) * 13.9
          return <circle key={index} cx={x} cy={y} r={1.18} fill="rgba(243, 254, 255, 0.88)" />
        })}
      </g>
    </>}

    {slowed && <>
      <circle cx={0} cy={0} r={16} fill="url(#ball_slow_halo)" />
      <circle cx={0} cy={0} r={17.2} fill="none" stroke="rgba(129, 224, 250, 0.72)" strokeWidth={0.95} strokeDasharray="3 6" />
      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="360 0 0" to="0 0 0" dur="1.2s" repeatCount="indefinite" />
        {[0, 72, 144, 216, 288].map((angle, index) => (
          <g key={index} transform={`rotate(${angle}) translate(0,-18.4)`}>
            <path
              d="M-0.8 0 C1.4 -2.6 4 -2.6 6.2 0"
              fill="none"
              stroke="rgba(177, 241, 255, 0.92)"
              strokeWidth={0.9}
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </>}

    {stunned && <>
      <circle cx={0} cy={0} r={15.8} fill="none" stroke="rgba(250, 228, 149, 0.46)" strokeWidth={1.05} strokeDasharray="4 5" />
      <g>
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 0 0" to="360 0 0" dur="0.95s" repeatCount="indefinite" />
        {[0, 120, 240].map((angle, index) => (
          <g key={index} transform={`rotate(${angle}) translate(0,-19)`}>
            <polygon
              points={starPoints(4.6, 2.1, 5)}
              fill="rgba(255, 235, 156, 0.95)"
              stroke="rgba(255, 204, 109, 0.9)"
              strokeWidth={0.65}
            />
          </g>
        ))}
      </g>
    </>}
  </g >
}

export default React.memo(BallComponent);
