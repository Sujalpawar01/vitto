export function StatusBadge({ status }) {
  const cleanStatus = (status || 'pending').toLowerCase();
  
  let label = 'Pending';
  let className = 'badge badge-pending';
  
  if (cleanStatus === 'approved') {
    label = 'Approved';
    className = 'badge badge-approved';
  } else if (cleanStatus === 'rejected') {
    label = 'Rejected';
    className = 'badge badge-rejected';
  }
  
  return <span className={className}>{label}</span>;
}

export function LanguageBadge({ language }) {
  const cleanLang = (language || 'English').trim();
  const lowerLang = cleanLang.toLowerCase();
  
  let className = 'badge ';
  if (lowerLang === 'hindi') className += 'badge-lang-hindi';
  else if (lowerLang === 'tamil') className += 'badge-lang-tamil';
  else if (lowerLang === 'telugu') className += 'badge-lang-telugu';
  else if (lowerLang === 'marathi') className += 'badge-lang-marathi';
  else className += 'badge-lang-english';
  
  return <span className={className}>{cleanLang}</span>;
}
