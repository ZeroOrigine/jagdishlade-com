import type { Config } from '@netlify/functions';

export default async () => {
  const site = process.env.URL || 'https://jagdishlade.com';
  const key = process.env.CRON_SECRET || '';
  try {
    const r = await fetch(`${site}/api/essays/run`, { headers: { 'x-cron-key': key } });
    const body = await r.text();
    console.log('essay-cron', r.status, body.slice(0, 300));
  } catch (e) {
    console.log('essay-cron error', String(e));
  }
  return new Response('ok');
};

export const config: Config = { schedule: '@hourly' };
