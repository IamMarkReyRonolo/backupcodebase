<template>
	<div class="openResponseExactDiv">
		<div class="optionField">
			<div class="optionWrapper1">
				<div class="fieldLabel largeView">
					Answer - Alt + Enter to add equation *
				</div>

				<div class="fieldLabel smallView">Answer</div>
				<div class="optionContent">
					<div class="option">
						<v-textarea
							filled
							auto-grow
							rows="1"
							row-height="20"
							@keydown.enter.alt.exact.prevent="doSomething"
							ref="textarea"
							@keyup="updateProp"
							v-model="multipleChoices[0].content"
							:rules="required"
							id="inputOption-OpenResponseField"
						></v-textarea>
						<v-btn
							small
							class="smallView"
							@click="doSomething"
							id="addEquationBtn-OpenResponseField"
							>Add Equation</v-btn
						>
					</div>
				</div>
			</div>

			<br />

			<div class="optionWrapper2">
				<div class="fieldLabel largeView">
					Unit - Alt + Enter to add equation
				</div>

				<div class="fieldLabel smallView">Unit</div>

				<div class="optionContent unit">
					<div class="option">
						<v-textarea
							filled
							auto-grow
							rows="1"
							row-height="20"
							@keydown.enter.alt.exact.prevent="doSomething('2')"
							ref="textAreaUnit"
							@keyup="updateProp"
							v-model="multipleChoices[0].unit"
							id="inputOption-UnitField"
							hint="not required"
							persistent-hint
						></v-textarea>
						<v-btn
							small
							class="smallView"
							@click="doSomething('2')"
							id="addEquationBtn-Unit"
							>Add Equation</v-btn
						>
					</div>
				</div>
			</div>
		</div>

		<AddEquationModal
			:dialog="dialog"
			@cancelDialog="cancelDialog"
			@addEquation="addEquation"
		/>
	</div>
</template>

<script>
	import AddEquationModal from "../AddEquationModal.vue";
	export default {
		components: {
			AddEquationModal,
		},
		props: {
			options: Array,
		},

		created() {
			this.multipleChoices[0] = this.options[0];
			this.multipleChoices[0].is_answer = true;
			this.multipleChoices[0].image = "";
			this.$emit("updateOptions", this.multipleChoices);
		},
		data: () => ({
			dialog: false,
			insertText: "",
			multipleChoices: [],
			required: [(v) => !!v || "Required"],
			number: "",
		}),
		methods: {
			updateProp() {
				this.$emit("updateOptions", this.multipleChoices);
			},

			doSomething(number) {
				this.dialog = true;
				this.number = number;
			},

			cancelDialog() {
				this.dialog = false;
			},

			addEquation(equation) {
				this.insertText = equation;
				this.dialog = false;
				this.execInsertText();
			},

			// execInsertText() {
			// 	const insertText = "$" + this.insertText + "$";
			// 	if (!insertText.length) return;

			// 	const textarea = this.$refs.textarea.$refs.input;
			// 	const sentence = textarea.value;
			// 	const len = sentence.length;
			// 	let pos = textarea.selectionStart;
			// 	if (pos === undefined) {
			// 		pos = 0;
			// 	}

			// 	const before = sentence.substr(0, pos);
			// 	const after = sentence.substr(pos, len);

			// 	this.multipleChoices[0].content = before + insertText + after;

			// 	this.$nextTick().then(() => {
			// 		textarea.selectionStart = pos + insertText.length;
			// 	});
			// },

			execInsertText() {
				const insertText = "$" + this.insertText + "$";
				if (!insertText.length) return;
				let textarea = null;
				if (this.number == "1") {
					textarea = this.$refs.textarea.$refs.input;
				} else {
					textarea = this.$refs.textAreaUnit.$refs.input;
				}

				const sentence = textarea.value;
				const len = sentence.length;
				let pos = textarea.selectionStart;
				if (pos === undefined) {
					pos = 0;
				}

				const before = sentence.substr(0, pos);
				const after = sentence.substr(pos, len);

				if (this.number == "1") {
					this.multipleChoices[0].content = before + insertText + after;
				} else {
					this.multipleChoices[0].unit = before + insertText + after;
				}

				this.$nextTick().then(() => {
					textarea.selectionStart = pos + insertText.length;
				});
			},
		},
	};
</script>

<style scoped>
	.questionCreation {
		padding: 20px;
		min-width: 60%;
		width: 100%;
	}

	.optionField {
		margin-bottom: -5px;
		display: flex;
	}

	.optionWrapper1 {
		width: 60%;
		margin-right: 20px;
	}

	.optionContent {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.option {
		width: 100%;
	}

	.smallView {
		display: none;
	}

	.unit {
		width: 200px;
	}
	@media only screen and (max-width: 750px) {
		.largeView {
			display: none;
		}

		.smallView {
			display: block;
		}
	}

	@media only screen and (max-width: 540px) {
		.fieldLabel {
			font-size: 12px;
		}

		.optionWrapper1 {
			width: 100%;
		}

		.option {
			width: 100%;
		}

		.optionField {
			margin-bottom: -5px;
			display: block;
		}
	}
</style>
