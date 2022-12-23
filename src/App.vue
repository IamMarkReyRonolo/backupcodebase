<template>
	<v-app class="mainApp">
		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
	export default {
		name: "App",

		data: () => ({}),
		methods: {},
	};
</script>

<style>
	/* html {
		overflow-y: hidden !important;
	} */
	#app {
		font-family: "Poppins", sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background-color: #ffffff;
	}
	.mainApp {
		background-color: #ffffff;
	}
</style>
