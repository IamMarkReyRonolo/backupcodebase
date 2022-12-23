<template>
	<div class="notFoundCon">
		<div class="titleCon" style="text-align: center" @click="goToLanding">
			<span class="math">Math</span><span class="world">World</span>
		</div>

		<br />
		<br />
		<div class="imgCon">
			<img src="../../assets/pagenotfound.png" alt="" />
		</div>
		<h2>Page Not Found</h2>
	</div>
</template>

<script>
	export default {
		data: () => ({}),
		methods: {
			goToLanding() {
				this.$router.push("/");
			},
		},
	};
</script>

<style scoped>
	.notFoundCon {
		text-align: center;
		margin: 50px auto;
	}

	img {
		width: 400px;
	}

	h2 {
		color: #4c5b77;
	}

	.titleCon {
		font-size: 30px;
		padding: 20px;
		cursor: pointer;
	}

	.math {
		font-weight: 500;
		color: #4f5d79;
	}

	@media only screen and (max-width: 850px) {
		img {
			width: 300px;
		}
	}

	@media only screen and (max-width: 600px) {
		img {
			width: 200px;
		}

		h2 {
			font-size: 18px;
		}
	}
</style>
