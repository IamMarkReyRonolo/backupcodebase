<template>
	<div class="loadingCon">
		<div class="imgCon">
			<img src="../../assets/loadingIcon.png" alt="" srcset="" />
		</div>
		<div class="message">Fetching Data</div>
		<div class="loadingDiv">
			<v-progress-linear
				indeterminate
				color="#4C5B77"
				width="200"
			></v-progress-linear>
		</div>
	</div>
</template>

<script>
	export default {
		data: () => ({}),
		methods: {},
	};
</script>

<style scoped>
	.loadingCon {
		padding: 40px;
		text-align: center;
	}

	.imgCon img {
		width: 150px;
	}

	.message {
		padding: 15px;
	}

	.loadingDiv {
		width: 300px;
		margin: auto;
	}

	@media only screen and (max-width: 850px) {
		.imgCon img {
			width: 100px;
		}

		.message {
			padding: 10px;
		}

		.loadingDiv {
			width: 200px;
		}
	}

	@media only screen and (max-width: 600px) {
		.imgCon img {
			width: 70px;
		}

		.message {
			padding: 10px;
			font-size: 12px;
		}

		.loadingDiv {
			width: 150px;
			margin: auto;
		}
	}
</style>
