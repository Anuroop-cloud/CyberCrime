// HealthSutra / Aarvak Inspired Design System Tokens for CasePilot Web Portal

export const portalTheme = {
  colors: {
    canvasBg: '#F8FAFC',
    cardBg: '#FFFFFF',
    cardBorder: '#E2E8F0',
    cardBorderHover: '#CBD5E1',
    headerBg: '#F8FAFC',
    headerBorder: '#E2E8F0',
    
    // Typography
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textLight: '#94A3B8',
    
    // Accents & Hmaven Palette
    accentPrimary: '#0F766E', // CasePilot Deep Teal
    accentHover: '#115E59',
    accentLight: '#F0FDFA',
    accentBorder: '#CCFBF1',
    secondaryTeal: '#14B8A6', // Folder & badge accent
    deepPetrolTeal: '#2D6A68', // HealthSummary benchmark card
    deepPetrolDark: '#174240',
    heroDarkStart: '#3A3A3A',
    heroDarkEnd: '#202020',
    
    // States
    successBg: '#DCFCE7',
    successText: '#15803D',
    successBorder: '#BBF7D0',
    
    warningBg: '#FEF3C7',
    warningText: '#92400E',
    warningBorder: '#FCD34D',
    
    dangerBg: '#FEE2E2',
    dangerText: '#DC2626',
    dangerBorder: '#FECACA',
    
    infoBg: '#F1F5F9',
    infoText: '#334155',
    infoBorder: '#E2E8F0',
  },
  
  hmaven: {
    heroContainer: {
      borderRadius: 16,
      background: 'radial-gradient(50% 50% at 70% 67%, #3A3A3A 0%, #202020 100%)',
      boxShadow: 'inset 0 0 24px 1.25px #181818',
      color: '#FFFFFF',
      padding: '16px 22px',
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'transform 150ms ease, box-shadow 150ms ease',
    } as React.CSSProperties,
    
    petrolCard: {
      borderRadius: 16,
      background: 'linear-gradient(135deg, #2D6A68 0%, #174240 100%)',
      color: '#FFFFFF',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      cursor: 'pointer',
      minHeight: 160,
      transition: 'transform 150ms ease, box-shadow 150ms ease',
    } as React.CSSProperties,

    whiteCardWithShadow: {
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 16,
      boxShadow: 'inset 0 0 65px -8px rgba(21, 24, 27, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'space-between',
      cursor: 'pointer',
      minHeight: 160,
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    } as React.CSSProperties,
  },
  
  // Reusable Container Box Styles
  containers: {
    sectionCard: {
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    } as React.CSSProperties,
    
    cardHeader: {
      padding: '14px 20px',
      borderBottom: '1px solid #E2E8F0',
      background: '#FAFAFA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    
    cardBody: {
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    } as React.CSSProperties,
    
    infoBanner: {
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 12.5,
      color: '#334155',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    } as React.CSSProperties,
  },
  
  // Table Standard Styles
  table: {
    table: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: 12.5,
    },
    theadRow: {
      background: '#F8FAFC',
      borderBottom: '1px solid #E2E8F0',
    } as React.CSSProperties,
    th: {
      padding: '10px 16px',
      textAlign: 'left' as const,
      fontSize: 11,
      fontWeight: 700,
      color: '#64748B',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    } as React.CSSProperties,
    tbodyRow: {
      borderBottom: '1px solid #F1F5F9',
      transition: 'background 120ms ease',
    } as React.CSSProperties,
    td: {
      padding: '12px 16px',
      color: '#334155',
      verticalAlign: 'middle' as const,
    } as React.CSSProperties,
  },
  
  // Form Field Styles
  forms: {
    label: {
      fontSize: 12,
      fontWeight: 600,
      color: '#334155',
      marginBottom: 6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    
    input: {
      width: '100%',
      height: 38,
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      fontSize: 13,
      color: '#0F172A',
      background: '#FFFFFF',
      outline: 'none',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    } as React.CSSProperties,
    
    select: {
      width: '100%',
      height: 38,
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      fontSize: 13,
      color: '#0F172A',
      background: '#FFFFFF',
      outline: 'none',
      cursor: 'pointer',
    } as React.CSSProperties,
    
    textarea: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: 6,
      border: '1px solid #CBD5E1',
      fontSize: 13,
      color: '#0F172A',
      background: '#FFFFFF',
      outline: 'none',
      resize: 'vertical' as const,
      lineHeight: 1.5,
    } as React.CSSProperties,
  },
};
