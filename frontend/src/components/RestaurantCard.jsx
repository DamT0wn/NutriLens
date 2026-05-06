export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <article
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick?.()
        }
      }}
      role="button"
      tabIndex={0}
      style={{
        flexShrink: 0,
        width: '160px',
        background: 'var(--surface)',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s var(--ease-spring), box-shadow 0.2s ease',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '12px',
          color: 'var(--text)',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {restaurant.name}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {restaurant.address}
      </div>
      <div style={{ fontSize: '11px', marginTop: '8px', color: 'var(--amber)' }}>
        ⭐ {restaurant.rating?.toFixed?.(1) ?? restaurant.rating ?? '4.5'}
      </div>
      <div style={{ marginTop: '10px' }}>
        <a
          href={restaurant.mapsUrl || '#'}
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '11px', color: 'var(--orange)', textDecoration: 'none', fontWeight: 500 }}
        >
          Go →
        </a>
      </div>
    </article>
  )
}
