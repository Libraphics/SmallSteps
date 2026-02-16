import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/en/login' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: String(credentials.email) } });
        if (!user) return null;
        const valid = await bcrypt.compare(String(credentials.password), user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.email, locale: user.locale };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        // @ts-expect-error custom field
        token.locale = user.locale;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error custom field
        session.user.id = token.userId as string;
        // @ts-expect-error custom field
        session.user.locale = token.locale as string;
      }
      return session;
    }
  }
});
