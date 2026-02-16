import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const mode = req.nextUrl.searchParams.get('mode');

  if (mode === 'signup') {
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');
    const locale = String(formData.get('locale') || 'en');
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash, locale: locale as 'en' | 'ar' } });
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const title = String(formData.get('title') || '');
  const description = String(formData.get('description') || '');
  const privateMode = String(formData.get('privateMode') || 'false') === 'true';

  await prisma.objective.create({
    data: {
      userId: (session.user as any).id,
      title,
      description,
      privateMode,
      status: 'active'
    }
  });

  return NextResponse.redirect(new URL('/en/dashboard', req.url));
}
