import { Revenue } from '@/app/lib/definitions';
import { ResponseType } from '@/app/server/common';
import { dbClient } from '@/app/server/dbClient';
import { revenue } from '@/app/server/schema/revenue.schema';

export async function getRevenue(): Promise<Revenue[] | undefined> {
  try {
    return await dbClient.select().from(revenue);
  } catch (error) {
    console.log((error as Error).message);
  }
}
