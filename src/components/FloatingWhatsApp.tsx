export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/918050410310"
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa-btn group"
    >
      <span className="relative overflow-hidden flex flex-col justify-start" style={{ width: '22px', height: '22px' }}>
        <span className="wa-icon-slide-container flex flex-col">
          {/* WhatsApp Icon */}
          <svg viewBox="0 0 32 32" className="flex-shrink-0" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ width: '22px', height: '22px' }}>
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.676 4.797 1.854 6.785L2 30l7.43-1.826A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.84-1.6l-.418-.25-4.41 1.084 1.116-4.298-.274-.44A11.44 11.44 0 0 1 4.5 16C4.5 9.596 9.596 4.5 16 4.5S27.5 9.596 27.5 16 22.404 27.5 16 27.5zm6.29-8.56c-.344-.172-2.036-1.004-2.352-1.118-.316-.115-.547-.172-.777.172-.23.344-.892 1.118-1.094 1.348-.2.23-.403.258-.747.086-.344-.172-1.453-.536-2.768-1.708-1.022-.912-1.713-2.038-1.913-2.382-.2-.344-.021-.53.15-.702.154-.154.344-.402.516-.603.172-.2.23-.344.344-.573.115-.23.058-.43-.029-.603-.086-.172-.777-1.875-1.065-2.567-.28-.672-.565-.581-.777-.592l-.662-.011c-.23 0-.603.086-.919.43-.316.344-1.207 1.18-1.207 2.877 0 1.697 1.236 3.337 1.408 3.567.172.23 2.433 3.715 5.895 5.208.824.355 1.467.567 1.968.726.827.263 1.58.226 2.175.137.663-.1 2.036-.832 2.323-1.636.287-.804.287-1.493.2-1.636-.086-.143-.316-.23-.66-.402z"/>
          </svg>
          {/* House Icon */}
          <svg viewBox="0 0 24 24" className="flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" style={{ width: '22px', height: '22px' }}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
      </span>
    </a>
  );
}
