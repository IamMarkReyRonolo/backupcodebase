<template>
	<div class="errorCon">
		<div class="imgCon">
			<img src="../../assets/errorIcon.png" alt="" srcset="" />
		</div>
		<div class="message">
			An error has occured. That's all we know.

			<div class="refreshBtn">
				<v-btn dense color="#5A6882" dark @click="refresh()">Refresh </v-btn>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data: () => ({}),
		methods: {
			refresh() {
				this.$emit("refresh");
			},
		},
	};
</script>

<style scoped>
	.errorCon {
		padding: 20px;
		text-align: center;
	}

	.imgCon img {
		width: 250px;
	}

	.message {
		padding: 20px;
		width: 400px;
		text-align: center;
		margin: auto;
		font-size: 14px;
	}

	.refreshBtn {
		padding: 15px;
	}

	@media only screen and (max-width: 850px) {
		.imgCon img {
			width: 150px;
		}

		.message {
			width: 250px;
			font-size: 10px;
		}

		.loadingDiv {
			width: 200px;
		}
	}

	@media only screen and (max-width: 600px) {
		.imgCon img {
			width: 150px;
		}

		.message {
			padding: 10px;
			font-size: 10px;
		}

		.loadingDiv {
			width: 100px;
			margin: auto;
		}

		.refreshBtn .v-btn {
			font-size: 12px;
			height: 24px;
		}
	}
</style>
