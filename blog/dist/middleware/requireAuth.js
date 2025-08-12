import { createClient } from '@supabase/supabase-js';
export const requireAuth = async (c, next) => {
    const authHeader = c.req.header('authorization');
    if (!authHeader) {
        return c.json({ error: 'Missing Authorization header' }, 401);
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return c.json({ error: 'Malformed Authorization header' }, 401);
    }
    const token = parts[1];
    const supabaseServer = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabaseServer.auth.getUser(token);
    if (error || !data?.user) {
        return c.json({ error: 'Invalid or expired token' }, 401);
    }
    c.set('user', data.user);
    await next();
};
