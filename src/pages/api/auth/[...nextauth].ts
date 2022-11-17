// estrategias de autenticação
// 1 - jwt salvo no storgae com data de expiração, geralmente baixa
// 2 - next auth utilizado quando queremos um sistema de autenticação simple (login social tipo com google, facebook, github) e nao quer se preocupar em armazenar credenciais em BD
// 3 - servicos externos como cognito, auth 0 que vao se conectar e armazenar dados, enviar email

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { fauna } from "../../../services/fauna";
import { query } from "faunadb";

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || '6f03ab1cd6a66ab68183',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || 'd70fac3dda1193cad6fd6d83ac97845fea7548ab',
			// authorization: { params: { scope: "openid your_custom_scope" } },
		}),
		// ...add more providers here
	],
	callbacks: {
		async signIn({ user, account, profile }) {
			const { email, name, following } = user;
			console.log('email, name, following', email, name, following);

			try {
				await fauna.query(
					query.If(
						query.Not(
							query.Exists(
								query.Match(
									query.Index('user_by_email'),
									query.Casefold(email)
								)
							)
						),
						query.Create(
							query.Collection('users'),
							{
								data: {
									email: email,
									name: name,
									following: following,
								}
							}
						),
						query.Get(
							query.Match(
								query.Index('user_by_email'),
								query.Casefold(email)
							)
						)
					)

				)

				return true
			} catch {
				console.error('Error creating user');

				return false
			}
		},
	}
};
export default NextAuth(authOptions);