import { db } from '@/lib/db';

const user = db.user.findFirst();
console.log(user);
