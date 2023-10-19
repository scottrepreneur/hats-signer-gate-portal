import { Box, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "../Header/Header";
import HeaderActions from "../HeaderActions/HeaderActions";
import { HEADER_ACTIONS } from "../../context/SelectedActionContext";
import { findAction } from "../../utils/utils";
import React from "react";

interface P {
	children: React.ReactNode;
}
const Layout: React.FC<P> = (p) => {
	const router = useRouter();
	const path = router.asPath;
	const pathSegment = findAction(path, 1);

	return (
		<div>
			<Head>
				<title>Hat Signer Gate Portal</title>
				<meta
					content="Generated by @rainbow-me/create-rainbowkit"
					name="description"
				/>
				<link href="/favicon/favicon.ico" rel="icon" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/favicon/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon/favicon-16x16.png"
				/>
				<link rel="manifest" href="/favicon/site.webmanifest" />
			</Head>

			<VStack minH="100vh">
				<Header />
				<Box alignSelf="flex-start">
					<HeaderActions
						selectedAction={pathSegment as HEADER_ACTIONS}
					/>
				</Box>
				{p.children}
			</VStack>
		</div>
	);
};

export default Layout;
