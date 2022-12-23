<template>
	<div class="emptyCon">
		<div class="titleCon" style="text-align: center">
			<span class="math">Math</span><span class="world">World</span>
		</div>

		<br />
		<div class="imgCon">
			<img src="../../assets/nointernet.png" alt="" srcset="" />
		</div>
		<div class="message">Network Error. That's all we know</div>
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
		margin-top: 80px;
		padding: 40px;
		text-align: center;
	}

	.imgCon img {
		width: 200px;
		margin-left: 40px;
	}

	.message {
		padding: 20px;
		width: 400px;
		text-align: center;
		margin: auto;
		font-size: 20px;
		font-weight: 500;
	}

	.titleCon {
		font-size: 30px;
		padding: 20px;
	}

	.math {
		font-weight: 500;
		color: #4f5d79;
	}
	@media only screen and (max-width: 850px) {
		.imgCon img {
			width: 200px;
		}
	}

	@media only screen and (max-width: 600px) {
		.imgCon img {
			width: 150px;
		}
		.message {
			padding: 10px;
			font-size: 14px;
			width: 200px;
		}

		.titleCon {
			font-size: 24px;
			padding: 20px;
		}
	}
</style>
