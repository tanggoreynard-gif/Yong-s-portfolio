import { SealCheck } from '@/components/slab'
import { profile } from '@/data/profile'
import QuickMenu from './QuickMenu'

/**
 * Home on a phone:
 *   HomeProfile: avatar, name, verified mark, role and the QuickMenu
 *   HomeStats: three proof facts (profile.stats)
 */

export function HomeProfile() {
  return (
    <header className="hprofile">
      <img className="hprofile__avatar" src={profile.avatarSrc} alt="" width={56} height={56} />
      <div className="hprofile__who">
        <span className="hprofile__name">
          {profile.name}
          <SealCheck size={16} weight="fill" className="hprofile__verified" aria-label={profile.verifiedLabel} />
        </span>
        <span className="hprofile__handle" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <img src="/certified-admin-badge.png" alt="HighLevel Certified Admin" width={16} height={20} style={{ objectFit: 'contain' }} />
          <span>HighLevel Certified Admin</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
          <img src="/hla_badge.png" alt="HLA Certified Builder" width={13} height={13} style={{ objectFit: 'contain' }} />
          <span>HLA Automation Builder</span>
        </span>
      </div>
      <QuickMenu className="hprofile__menu" />
    </header>
  )
}

export function HomeStats() {
  return (
    <ul className="hstats" role="list">
      {profile.stats.map(({ value, label, Icon }, i) => (
        <li key={i}>
          <Icon className="hstats__icon" size={18} weight="duotone" aria-hidden="true" />
          <b className="hstats__value">{value}</b>
          <span className="hstats__label">{label}</span>
        </li>
      ))}
    </ul>
  )
}
