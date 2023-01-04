<template>
	<v-dialog v-model="dialog" max-width="800" persistent style="z-index: 0">
		<v-card>
			<div class="addEquation">
				<h2>Add Equation</h2>
				<div class="questionContent">
					<div class="question">
						<div class="equation" v-if="dialog">
							<!-- <MathLiveInput
								:config="config"
								v-model="equation"
								v-on:input="input()"
							>
							</MathLiveInput> -->

							<math-field
								smartMode
								style="
									font-size: 20px;
									margin: 1em;
									padding: 10px;
									border-radius: 8px;
									background-color: #eeeeee;
									border: 1px solid rgba(0, 0, 0, 0.3);
									box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
									color: black;
									cursor: text;
									min-height: 70px;
								"
								virtual-keyboard-mode="manual"
								ref="mathfield"
								id="mathField"
							>
							</math-field>
						</div>
					</div>
				</div>
				<div class="btns">
					<v-btn
						text
						width="100"
						color="#4c5b77"
						@click="cancelDialog"
						id="cencelBtn"
						>Cancel</v-btn
					>
					<v-btn
						width="100"
						color="#4c5b77"
						dark
						@click="addEquation"
						id="addEquationBtn"
						>Add</v-btn
					>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
	import MathLiveInput from "./MathLiveInput.vue";
	import MathLive from "mathlive";
	export default {
		components: {
			MathLiveInput,
		},
		props: { dialog: Boolean },
		data: () => ({
			config: {
				smartMode: true,
				virtualKeyboardMode: "manual",
			},
			equation: "",
		}),
		methods: {
			input() {},
			cancelDialog() {
				this.equation = "";
				this.$emit("cancelDialog");
			},
			addEquation() {
				this.equation = this.$refs["mathfield"].value;
				this.$emit("addEquation", this.equation);

				this.equation = "";
			},
		},

		mounted() {
			MathLive.renderMathInDocument();
			//   this.$refs["mathfield"].addEventListener('input',(ev) => {
			//     this.equation =  mf.value;
			// });
		},
	};
</script>

<style scoped>
	.addEquation {
		z-index: 2;
		background-color: white;
		padding: 40px;
		color: #4c5b77;
	}

	.questionContent {
		width: 100%;
		display: flex;
	}

	.question {
		width: 100%;
		margin: 30px 0px;
	}

	/* .equation {
		border: #aeaeae;
		background: #eeeeee;
		cursor: text;
		padding: 20px;
		margin: 0px;
		height: 100px;
		overflow-x: auto;
		overflow-y: hidden;
	} */

	.btns {
		display: flex;
		justify-content: flex-end;
	}

	#math {
		z-index: 3000 !important;
	}
</style>
