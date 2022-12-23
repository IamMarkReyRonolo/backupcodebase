<template>
	<div class="accessDenied">
		<div class="titleCon" style="text-align: center" @click="goToLanding">
			<span class="math">Math</span><span class="world">World</span>
		</div>

		<br />
		<br />
		<div class="imgCon">
			<img src="../../assets/accessdenied.png" alt="" />
		</div>
		<h2>Access Denied</h2>
		<p class="message">You don't have permission to access this page.</p>
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
	.accessDenied {
		text-align: center;
		margin: 50px auto;
	}

	img {
		width: 400px;
	}

	h2 {
		color: #4c5b77;
	}

	.message {
		color: #4c5b77;
		width: 400px;
		margin: auto;
		padding: 10px;
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

		.message {
			width: 200px;
			font-size: 12px;
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
