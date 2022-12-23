<template>
	<div class="notFoundCon">
		<h2 id="notFound">Question Not Found</h2>
    <p>Maybe this question was deleted or you have put an incorrect id.</p>
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

	

	h2 {
		color: #4c5b77;
    padding:10px
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
			width: 150px;
		}
	}

	@media only screen and (max-width: 600px) {
		img {
			width: 100px;
		}

		h2 {
			font-size: 18px;
		}

    p{
      font-size: 12px;
    }
	}
</style>
