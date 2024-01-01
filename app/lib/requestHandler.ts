import { ResponseType } from '@/app/server/apis/apis';

export default async function requestHandler(
  fn: (...args: any[]) => Promise<ResponseType & { data?: any }>,
) {
  try {
    const { success, data, message } = await fn();
    if (!success) {
      console.log(message);
    } else {
      return data;
    }
  } catch (error) {
    console.log((error as Error).message);
  }
}
