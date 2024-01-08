'use server';

import { ResponseType } from '@/app/server/utils/common';
import { dbClient } from '@/app/server/utils/dbClient';
import { NewUser, User, users } from '@/app/server/schema/user.schema';
import { eq } from 'drizzle-orm';

export async function createUser({
  email,
  name,
  password,
}: NewUser): Promise<User | undefined> {
  try {
    return (
      await dbClient.insert(users).values({ name, email, password }).returning()
    )[0];
  } catch (error) {
    console.log((error as Error).message);
  }
}

export async function getUser(userId: string): Promise<User | undefined> {
  try {
    return (
      await dbClient
        .select()
        .from(users)
        .where(eq(users.id, userId as string))
    )[0];
  } catch (error) {
    console.log((error as Error).message);
  }
}
