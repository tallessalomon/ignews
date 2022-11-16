import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import styles from "./home.module.scss";
import { stripe } from "./../services/stripe";

interface HomeProps {
	product: {
		priceId: string;
		amount: number;
	};
}
export default function Home({ product }: HomeProps) {
	return (
		<>
			<Head>
				<title>Home | ig.news</title>
			</Head>
			<main className={styles.contentContainer}>
				<section className={styles.hero}>
					<span>👋 Hey, welcome</span>
					<h1>
						News about the <span>React</span> world.
					</h1>
					<p>
						Get access to all the publications <br />
						<span>for {product.amount} per month</span>
					</p>
					<SubscribeButton priceId={product.priceId} />
				</section>

				<img src="/images/avatar.svg" alt="illustration of a girl coding" />
			</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	// tudo que eu passar aqui no retorno como uma propriedade, eu consigo acessar lá em cima no começo da pagina
	// o que acontece dentro dessa função é executado no servidor node (camada entre o browser e o código react)

	const price = await stripe.prices.retrieve(
		"price_1M4pr0I0FJzrhLuxcuaJ4pfJ"
		// {
		// 	expand: ['product']
		// }
	);

	const product = {
		priceId: price.id,
		amount: new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(price.unit_amount! / 100),
	};

	return {
		props: {
			product,
		},
		revalidate: 60 * 60 * 24,
	};
};
