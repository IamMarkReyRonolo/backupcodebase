<template>
	<div class="emptyCon">
		<div class="imgCon">
			<img src="../../assets/nodata.png" alt="" srcset="" />
		</div>
		<div class="message">Ooops, it seems like there are no data to show.</div>
	</div>
</template>

<script>
	export default {
		data: () => ({}),
		methods: {},
	};
</script>

<style scoped>
	.emptyCon {
		padding: 20px;
		text-align: center;
	}

	.imgCon img {
		width: 200px;
	}

	.message {
		padding: 20px;
		width: 400px;
		text-align: center;
		margin: auto;
		font-size: 14px;
	}

	@media only screen and (max-width: 850px) {
		.imgCon img {
			width: 150px;
		}

		.message {
			width: 400px;
			font-size: 12px;
		}
	}

	@media only screen and (max-width: 600px) {
		.imgCon img {
			width: 100px;
		}

		.message {
			padding: 10px;
			font-size: 10px;
			width: 150px;
		}
	}
</style>
