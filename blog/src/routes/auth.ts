import { Hono } from 'hono';
import { z } from 'zod';
import { supabase, db } from '../db/client.js';
import { users } from '../db/schema.js';
import { logger } from '../middleware/logger.js';
import { pgRole, PgRole } from 'drizzle-orm/pg-core';
export const app = new Hono();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['admin',  'user']).default('user')
});




app.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const data = signupSchema.parse(body);

    const { data: supaData, error } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
           user_metadata: {
        full_name: data.name,
        role: data.role,
      },
      email_confirm: true,
       
      
    });

    if (error || !supaData?.user) {
      logger.error({ error: error?.message }, 'Supabase createUser error');
      return c.json({ error: error?.message || 'Signup failed' }, 400);
    }

    const user = supaData.user; 

  
    await db.insert(users).values({
      id: user.id,
      email: user.email!, 
      name: data.name,
       role: data.role,
      profilePhoto: user.user_metadata?.avatar_url ?? null,
    });

    logger.info({ id: user.id, email: user.email }, 'User signed up');

    return c.json({ message: 'Signup successful' });
  } catch (err) {
    logger.error({ err }, 'Signup error');
    return c.json({ error: 'Invalid input or server error' }, 400);
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});


app.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const data = loginSchema.parse(body);

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    if (error || !loginData.session) {
      logger.error({ error: error?.message }, 'Supabase login error');
      return c.json({ error: error?.message || 'Login failed' }, 400);
    }

    
    const { session, user } = loginData;

    logger.info({ id: user.id, email: user.email , role: user.user_metadata.role }, 'User logged in');

    return c.json({
      message: 'Login successful',
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata.role ?? null
      }
    });
  } catch (err) {
    logger.error({ err }, 'Login error');
    return c.json({ error: 'Invalid input or server error' }, 400);
  }
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

app.post('/forgot-password', async (c) => {
  try {
    const body = await c.req.json();
    const data = forgotPasswordSchema.parse(body);

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: 'http://localhost:3000/reset-password' 
    });

    if (error) {
      logger.error({ error: error.message }, 'Forgot password error');
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: 'Password reset email sent' });
  } catch (err) {
    logger.error({ err }, 'Forgot password request error');
    return c.json({ error: 'Invalid input or server error' }, 400);
  }
});

