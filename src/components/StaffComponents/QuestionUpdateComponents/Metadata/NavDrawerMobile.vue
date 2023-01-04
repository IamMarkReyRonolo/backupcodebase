<template>
	<div class="navDrawerMobileCon">
		<div class="smallConView" v-if="this.$vuetify.breakpoint.width <= 1000">
			<v-btn fab small id="drawerBtn"
				><v-icon color="#4c5b77" v-if="!openBurger" @click="clickNav('open')"
					>mdi-forwardburger</v-icon
				>
			</v-btn>

			<v-dialog
				v-model="openBurger"
				persistent
				fullscreen
				transition="dialog-left-transition"
			>
				{{ listenForMediaWidth }}
				<div class="navBarCon" v-if="openBurger">
					<v-btn fab small id="drawerBtn">
						<v-icon color="#4c5b77" v-if="openBurger" @click="clickNav('close')"
							>mdi-backburger</v-icon
						></v-btn
					>
					<QuestionMetdata />
				</div>
			</v-dialog>
		</div>

		<v-overlay
			:value="overlay"
			v-if="this.$vuetify.breakpoint.width <= 1000"
		></v-overlay>
	</div>
</template>

<script>
	import QuestionMetdata from "./QuestionMetadata.vue";
	export default {
		components: { QuestionMetdata },
		data: () => ({ overlay: false, openBurger: false }),
		methods: {
			clickNav(params) {
				if (params == "open") {
					this.openBurger = true;
					this.overlay = true;
				}

				if (params == "close") {
					this.openBurger = false;
					this.overlay = false;
				}
			},
		},
		computed: {
			listenForMediaWidth: function () {
				if (this.$vuetify.breakpoint.width <= 1000) {
					this.clickNav("open");
					this.openBurger = true;
					this.overlay = true;
				} else {
					this.clickNav("close");
				}
			},
		},
	};
</script>

<style scoped>
	.smallConView {
		display: none;
		padding: 10px 10px;

		position: absolute;

		z-index: 5;
		overflow: auto;

		left: -5px;
		margin: 0px;
		background-color: white;
	}

	.navBarCon {
		padding: 20px 10px;
		background-color: white;
		width: 375px;
		height: 100vh;
		overflow-y: auto;
		display: flex;
	}

	.smallConView .v-btn {
		margin-left: 5px;
		margin-top: 20px;
	}

	.detailsContentCon {
		margin-left: -10px;
	}

	.smallShow {
		display: none;
	}

	@media only screen and (max-width: 1000px) {
		.smallConView {
			display: flex;
		}
	}

	@media only screen and (max-width: 600px) {
		.smallShow {
			display: flex;
		}
	}

	@media only screen and (max-width: 540px) {
		.smallConView {
			background-color: transparent;
		}
		.smallConView .v-btn {
			height: 30px;
			width: 30px;
			margin-top: 0px;
		}
	}
</style>
