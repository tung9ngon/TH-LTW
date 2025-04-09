const APPLICATIONS_KEY = 'club_applications';
const MEMBERS_KEY = 'club_members';

export const getApplications = () =>
  JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]');

export const saveApplications = (apps: any[]) =>
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));

export const getMembers = () =>
  JSON.parse(localStorage.getItem(MEMBERS_KEY) || '[]');

export const saveMembers = (members: any[]) =>
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members));
